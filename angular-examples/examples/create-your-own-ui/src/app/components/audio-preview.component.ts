import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { defaultIconPack } from '@cloudflare/realtimekit-ui';

interface CurrentDevices {
  audio?: MediaDeviceInfo;
  speaker?: MediaDeviceInfo;
}

@Component({
  selector: 'app-audio-preview',
  template: `
    <div class="flex flex-col p-4">
      <audio
        #testAudioEl
        preload="auto"
        src="https://assets.dyte.io/ui-kit/speaker-test.mp3">
      </audio>
      <div *ngIf="meeting?.self?.permissions?.canProduceAudio === 'ALLOWED'">
        <label>Microphone</label>
        <div>
          <select
            class="mt-2 w-full text-ellipsis bg-[#1F1F1F] p-2"
            (change)="setDevice('audio', $event)">
            <option
              *ngFor="let device of audioDevices; trackBy: trackByDeviceId"
              [value]="device.deviceId"
              [selected]="currentDevices.audio?.deviceId === device.deviceId">
              {{device.label || 'Microphone ' + getUnnamedMicCount()}}
            </option>
          </select>
          <rtk-audio-visualizer [participant]="meeting?.self"></rtk-audio-visualizer>
        </div>
      </div>
      <div>
        <div *ngIf="speakerDevices.length > 0">
          <label>Speaker Output</label>
          <div>
            <select
              class="mt-2 w-full text-ellipsis bg-[#1F1F1F] p-2"
              (change)="setDevice('speaker', $event)">
              <option
                *ngFor="let device of speakerDevices; trackBy: trackByDeviceId"
                [value]="device.deviceId"
                [selected]="currentDevices.speaker?.deviceId === device.deviceId">
                {{device.label || 'Speaker ' + getUnnamedSpeakerCount()}}
              </option>
            </select>
          </div>
        </div>
        <rtk-button
          class="mt-2 bg-[#1F1F1F]"
          (click)="testAudio()"
          size="lg">
          <rtk-icon [icon]="speakerIcon"></rtk-icon>
          Test
        </rtk-button>
      </div>
    </div>
  `
})
export class AudioPreviewComponent implements OnInit, OnDestroy {
  @ViewChild('testAudioEl') testAudioEl!: ElementRef<HTMLAudioElement>;
  
  meeting: any;
  audioDevices: MediaDeviceInfo[] = [];
  speakerDevices: MediaDeviceInfo[] = [];
  currentDevices: CurrentDevices = {};
  speakerIcon = defaultIconPack.speaker;
  private unnamedMicCount = 0;
  private unnamedSpeakerCount = 0;
  private destroy$ = new Subject<void>();

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    // Get meeting from window object (similar to React useRealtimeKitMeeting)
    this.meeting = (this.document.defaultView as any)?.meeting;
    
    if (!this.meeting) {
      return;
    }

    const deviceListUpdateCallback = async () => {
      this.audioDevices = await this.meeting.self.getAudioDevices();
      this.speakerDevices = await this.meeting.self.getSpeakerDevices();
    };

    this.meeting.self.addListener('deviceListUpdate', deviceListUpdateCallback);
    
    // Populate first time values
    deviceListUpdateCallback();
    this.currentDevices = {
      audio: this.meeting.self.getCurrentDevices().audio,
      speaker: this.meeting.self.getCurrentDevices().speaker,
    };
  }

  ngOnDestroy() {
    if (this.meeting) {
      this.meeting.self.removeListener('deviceListUpdate', this.deviceListUpdateCallback);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private deviceListUpdateCallback = async () => {
    this.audioDevices = await this.meeting.self.getAudioDevices();
    this.speakerDevices = await this.meeting.self.getSpeakerDevices();
  };

  setDevice(kind: 'audio' | 'speaker', event: Event) {
    const deviceId = (event.target as HTMLSelectElement).value;
    const device = kind === 'audio'
      ? this.audioDevices.find(d => d.deviceId === deviceId)
      : this.speakerDevices.find(d => d.deviceId === deviceId);

    this.currentDevices = {
      ...this.currentDevices,
      [kind]: device,
    };

    if (device != null) {
      this.meeting.self.setDevice(device);
      if (device.kind === 'audiooutput') {
        if ((this.testAudioEl.nativeElement as any)?.setSinkId) {
          (this.testAudioEl.nativeElement as any)?.setSinkId(device.deviceId);
        }
      }
    }
  }

  testAudio() {
    this.testAudioEl?.nativeElement?.play();
  }

  trackByDeviceId(index: number, device: MediaDeviceInfo): string {
    return device.deviceId;
  }

  getUnnamedMicCount(): number {
    return ++this.unnamedMicCount;
  }

  getUnnamedSpeakerCount(): number {
    return ++this.unnamedSpeakerCount;
  }
}
