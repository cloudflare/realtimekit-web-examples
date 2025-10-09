import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { defaultIconPack } from '@cloudflare/realtimekit-ui';

interface CurrentDevices {
  video?: MediaDeviceInfo;
}

@Component({
  selector: 'app-video-preview',
  template: `
    <div class="flex flex-col p-4">
      <div>
        <rtk-participant-tile 
          *ngIf="meeting?.self?.videoEnabled === true; else cameraOff"
          [participant]="meeting?.self" 
          [isPreview]="true">
        </rtk-participant-tile>
        <ng-template #cameraOff>
          <rtk-participant-tile [participant]="meeting?.self">
            <div>
              <rtk-icon [icon]="videoOffIcon"></rtk-icon>
              <div>Camera Off</div>
            </div>
          </rtk-participant-tile>
        </ng-template>
      </div>
      <div>
        <label>Camera</label>
        <div>
          <select
            class="mt-2 w-full text-ellipsis bg-[#1F1F1F] p-2"
            (change)="setDevice('video', $event)">
            <option
              *ngFor="let device of videoDevices; trackBy: trackByDeviceId"
              [value]="device.deviceId"
              [selected]="currentDevices?.video?.deviceId === device.deviceId">
              {{device.label || 'Camera ' + getUnnamedCameraCount()}}
            </option>
          </select>
        </div>
      </div>
    </div>
  `
})
export class VideoPreviewComponent implements OnInit, OnDestroy {
  meeting: any;
  videoDevices: MediaDeviceInfo[] = [];
  currentDevices: CurrentDevices = {};
  videoOffIcon = defaultIconPack.video_off;
  private unnamedCameraCount = 0;
  private destroy$ = new Subject<void>();

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    // Get meeting from window object (similar to React useRealtimeKitMeeting)
    this.meeting = (this.document.defaultView as any)?.meeting;
    
    if (!this.meeting) {
      return;
    }

    const deviceListUpdateCallback = async () => {
      this.videoDevices = await this.meeting.self.getVideoDevices();
    };

    this.meeting.self.addListener('deviceListUpdate', deviceListUpdateCallback);
    
    // Populate first time values
    deviceListUpdateCallback();
    this.currentDevices = {
      video: this.meeting.self.getCurrentDevices().video,
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
    this.videoDevices = await this.meeting.self.getVideoDevices();
  };

  async setDevice(kind: 'video', event: Event) {
    const deviceId = (event.target as HTMLSelectElement).value;
    const device = this.videoDevices.find(d => d.deviceId === deviceId);

    this.currentDevices = {
      ...this.currentDevices,
      [kind]: device,
    };

    if (device != null) {
      await this.meeting?.self.setDevice(device);
    }
  }

  trackByDeviceId(index: number, device: MediaDeviceInfo): string {
    return device.deviceId;
  }

  getUnnamedCameraCount(): number {
    return ++this.unnamedCameraCount;
  }
}
