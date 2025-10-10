import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { StatesService } from '../services/states.service';
import { States } from '@cloudflare/realtimekit-ui';
import { defaultIconPack } from '@cloudflare/realtimekit-ui';

@Component({
  selector: 'app-meeting-control-bar',
  template: `
    <div class="flex w-full py-2 px-3 text-white justify-between">
      <div
        id="controlbar-left"
        class="flex items-center overflow-visible justify-center"
      >
        <rtk-fullscreen-toggle [targetElement]="fullScreenTargetElement"></rtk-fullscreen-toggle>
        <rtk-settings-toggle></rtk-settings-toggle>
        <rtk-screen-share-toggle></rtk-screen-share-toggle>
      </div>
      <div
        id="controlbar-center"
        class="flex items-center overflow-visible justify-center"
      >
        <rtk-mic-toggle></rtk-mic-toggle>
        <rtk-camera-toggle></rtk-camera-toggle>
        <rtk-stage-toggle></rtk-stage-toggle>
        <rtk-leave-button></rtk-leave-button>
        <rtk-more-toggle>
          <div slot="more-elements">
            <rtk-pip-toggle variant="horizontal"></rtk-pip-toggle>
            <rtk-mute-all-button variant="horizontal"></rtk-mute-all-button>
            <rtk-breakout-rooms-toggle variant="horizontal"></rtk-breakout-rooms-toggle>
            <rtk-recording-toggle variant="horizontal"></rtk-recording-toggle>
          </div>
        </rtk-more-toggle>
      </div>
      <div
        id="controlbar-right"
        class="flex items-center overflow-visible justify-center"
      >
        <rtk-chat-toggle></rtk-chat-toggle>
        <rtk-polls-toggle></rtk-polls-toggle>
        <rtk-participants-toggle></rtk-participants-toggle>
        <rtk-plugins-toggle></rtk-plugins-toggle>
        <rtk-controlbar-button
          [icon]="addIcon"
          label="Open Custom Sidebar"
          (click)="openCustomSidebar($event)">
        </rtk-controlbar-button>
      </div>
    </div>
  `
})
export class MeetingControlBarComponent implements OnInit, OnDestroy {
  fullScreenTargetElement!: HTMLElement;
  states: States = {} as States;
  addIcon = defaultIconPack.add;
  private destroy$ = new Subject<void>();

  constructor(
    private statesService: StatesService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.fullScreenTargetElement = this.document.querySelector('app-root') as HTMLElement;
    
    this.statesService.states$
      .pipe(takeUntil(this.destroy$))
      .subscribe(states => {
        this.states = states;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openCustomSidebar(event: Event) {
    console.log(this.states.activeSidebar);
    const target = event.currentTarget as HTMLElement;
    
    const stateUpdateEvent = new CustomEvent('rtkStateUpdate', {
      detail: {
        activeSidebar: (this.states.sidebar as any) !== 'warnings' 
          ? true 
          : !this.states.activeSidebar,
        sidebar: 'warnings',
      },
      bubbles: true,
      composed: true,
    });
    
    target.dispatchEvent(stateUpdateEvent);
  }
}
