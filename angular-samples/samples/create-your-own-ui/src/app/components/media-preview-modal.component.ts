import { Component, Input, OnInit, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { CustomStatesService } from '../services/states.service';
import { defaultIconPack } from '@cloudflare/realtimekit-ui';

@Component({
  selector: 'app-media-preview-modal',
  template: `
    <rtk-dialog
      [open]="open"
      (rtkDialogClose)="onDialogClose()">
      <div class="flex min-w-[720px] min-h-[480px] bg-[#222222]">
        <aside class="flex flex-col w-1/3 bg-[#181818]">
          <header class="flex justify-center items-center h-[100px]">
            <h2>Media Preview</h2>
          </header>
          <button
            *ngIf="meeting?.self?.permissions?.canProduceAudio === 'ALLOWED'"
            type="button"
            [class]="'flex justify-between p-2 rounded ' + (activeTab === 'audio' ? 'bg-[#2160FD]' : '')"
            (click)="setActiveTab('audio')">
            Audio
            <div>
              <rtk-icon [icon]="micOnIcon"></rtk-icon>
            </div>
          </button>
          <button
            *ngIf="meeting?.self?.permissions?.canProduceVideo === 'ALLOWED'"
            type="button"
            [class]="'flex justify-between p-2 rounded ' + (activeTab === 'video' ? 'bg-[#2160FD]' : '')"
            (click)="setActiveTab('video')">
            Video
            <div>
              <rtk-icon [icon]="videoOnIcon"></rtk-icon>
            </div>
          </button>
        </aside>
        <main class="flex flex-col w-2/3">
          <app-audio-preview *ngIf="activeTab === 'audio'"></app-audio-preview>
          <app-video-preview *ngIf="activeTab === 'video'"></app-video-preview>
        </main>
      </div>
    </rtk-dialog>
  `
})
export class MediaPreviewModalComponent implements OnInit, OnDestroy {
  @Input() open = false;
  
  meeting: any;
  activeTab: 'audio' | 'video' = 'video';
  micOnIcon = defaultIconPack.mic_on;
  videoOnIcon = defaultIconPack.video_on;
  private destroy$ = new Subject<void>();

  constructor(
    private customStatesService: CustomStatesService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    // Get meeting from window object (similar to React useRealtimeKitMeeting)
    this.meeting = (this.document.defaultView as any)?.meeting;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setActiveTab(tab: 'audio' | 'video') {
    this.activeTab = tab;
  }

  onDialogClose() {
    this.customStatesService.setCustomStates({ activeMediaPreviewModal: false });
  }
}
