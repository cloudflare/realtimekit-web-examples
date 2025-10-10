import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DOCUMENT } from '@angular/common';
import { CustomStatesService } from '../services/states.service';
import { CustomStates } from '../types';
import { defaultIconPack } from '@cloudflare/realtimekit-ui';
@Component({
  selector: 'app-setup-screen',
  template: `
    <div class="flex justify-around w-full h-full p-[5%] bg-black text-white">
      <div class="flex justify-around w-full h-full p-[5%]">
        <rtk-participant-tile [participant]="meeting?.self">
          <rtk-avatar [participant]="meeting?.self"></rtk-avatar>
          <rtk-name-tag [participant]="meeting?.self">
            <rtk-audio-visualizer [participant]="meeting?.self" slot="start"></rtk-audio-visualizer>
          </rtk-name-tag>
          <div id="user-actions" class="absolute flex bottom-2 right-2">
            <rtk-mic-toggle size="sm"></rtk-mic-toggle>
            <rtk-camera-toggle size="sm"></rtk-camera-toggle>
          </div>
          <div class="absolute top-2 right-2">
            <rtk-controlbar-button
              (click)="openMediaPreview()"
              [icon]="settingsIcon"
              label="Media Preview">
            </rtk-controlbar-button>
          </div>
        </rtk-participant-tile>
        <div class="h-1/2 w-1/4 flex flex-col justify-between">
          <div class="flex flex-col items-center">
            <p>Joining as</p>
            <div>{{participantName}}</div>
          </div>
          <input
            *ngIf="meeting?.self?.permissions?.canEditDisplayName"
            placeholder="Your name"
            class="bg-[#141414] rounded-sm border-[#EEEEEE] focus:border-[#2160FD] p-2.5 mb-10"
            [(ngModel)]="participantName"
            (input)="onNameChange($event)"
          />
          <rtk-button
            kind="wide"
            size="lg"
            [style.cursor]="participantName ? 'pointer' : 'not-allowed'"
            (click)="joinMeeting()">
            Join
          </rtk-button>
        </div>
        <app-media-preview-modal [open]="!!customStates.activeMediaPreviewModal"></app-media-preview-modal>
      </div>
    </div>
  `
})
export class SetupScreenComponent implements OnInit, OnDestroy {
  meeting: any;
  participantName = '';
  customStates: CustomStates = {};
  settingsIcon = defaultIconPack.settings;
  private destroy$ = new Subject<void>();

  constructor(
    private customStatesService: CustomStatesService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    console.log('Icon ::', this.settingsIcon)
    this.customStatesService.customStates$
      .pipe(takeUntil(this.destroy$))
      .subscribe(states => {
        this.customStates = states;
      });

    // Get meeting from window object (similar to React useRealtimeKitMeeting)
    this.meeting = (this.document.defaultView as any)?.meeting;
    if (this.meeting) {
      this.participantName = this.meeting.self.name;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onNameChange(event: any) {
    this.participantName = event.target.value;
  }

  openMediaPreview() {
    this.customStatesService.setCustomStates({
      activeMediaPreviewModal: true
    });
  }

  async joinMeeting() {
    if (this.participantName && this.meeting) {
      if (this.meeting.self.permissions.canEditDisplayName) {
        this.meeting.self.setName(this.participantName);
      }
      await this.meeting.join();
    }
  }
}
