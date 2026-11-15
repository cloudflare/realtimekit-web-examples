import { EffectsPipeline } from 'longpipe';

/**
 * Applies Longpipe effects to the local participant's camera.
 *
 * Longpipe turns a camera MediaStream into a processed MediaStream, so instead of a video
 * middleware we publish Longpipe's output track with `meeting.self.enableVideo(track)`.
 *
 * `meeting.self.enableVideo` is wrapped so that when the camera is turned back on while an
 * effect is active, the processed track is published directly, keeping the effect across
 * camera toggles.
 */
export class LongpipeEffects {
  #self;
  #enableVideo;
  #background = null; // Longpipe BackgroundInput, or null when no effect is active
  #pipeline = null;
  #cameraTrack = null;

  static isSupported() {
    return typeof OffscreenCanvas !== 'undefined' && typeof Worker !== 'undefined';
  }

  constructor(meeting) {
    this.#self = meeting.self;
    this.#enableVideo = this.#self.enableVideo.bind(this.#self);
    this.#self.enableVideo = (track) => this.#onEnableVideo(track);

    // The SDK does not stop custom tracks, so release the camera and pipeline ourselves
    this.#self.on('videoUpdate', ({ videoEnabled }) => {
      if (!videoEnabled) this.#stop();
    });
  }

  /** @param background Longpipe background, e.g. an image URL or `{ blur: { strength } }` */
  async setBackground(background) {
    this.#background = background;

    if (this.#pipeline) return this.#pipeline.setBackground(background);
    if (!this.#self.videoEnabled) return; // applied when the camera is turned on

    // Keep our own copy of the camera; disableVideo() stops the SDK's track
    const cameraTrack = this.#self.rawVideoTrack.clone();
    await this.#self.disableVideo();
    await this.#publish(cameraTrack);
  }

  async clearBackground() {
    this.#background = null;
    if (!this.#pipeline) return;

    await this.#self.disableVideo(); // triggers #stop() via videoUpdate
    await this.#enableVideo(); // SDK re-acquires the plain camera
  }

  async #onEnableVideo(track) {
    if (track || !this.#background) return this.#enableVideo(track);
    await this.#publish(await this.#getCameraTrack());
  }

  async #getCameraTrack() {
    const deviceId = this.#self.getCurrentDevices()?.video?.deviceId;
    const stream = await navigator.mediaDevices.getUserMedia({
      video: deviceId ? { deviceId: { exact: deviceId } } : true,
    });
    return stream.getVideoTracks()[0];
  }

  async #publish(cameraTrack) {
    this.#stop();
    this.#cameraTrack = cameraTrack;
    this.#pipeline = new EffectsPipeline(new MediaStream([cameraTrack]), {
      background: this.#background,
    });
    await this.#enableVideo(this.#pipeline.stream.getVideoTracks()[0]);
  }

  #stop() {
    this.#pipeline?.destroy();
    this.#cameraTrack?.stop();
    this.#pipeline = null;
    this.#cameraTrack = null;
  }
}
