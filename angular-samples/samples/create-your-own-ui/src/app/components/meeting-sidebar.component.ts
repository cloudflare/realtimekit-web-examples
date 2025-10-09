import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { StatesService } from '../services/states.service';
import { States } from '@cloudflare/realtimekit-ui';
import { RtkSidebarView } from '@cloudflare/realtimekit-ui/dist/types/components/rtk-sidebar-ui/rtk-sidebar-ui';

@Component({
  selector: 'app-meeting-sidebar',
  template: `
    <rtk-sidebar-ui
      *ngIf="states.activeSidebar && states.sidebar"
      [tabs]="tabs"
      [currentTab]="currentTab"
      [view]="view"
      class="w-96 max-w-full rounded-xl"
      (sidebarClose)="onSidebarClose()">
      
      <rtk-chat *ngIf="currentTab === 'chat'" slot="chat"></rtk-chat>
      <rtk-polls *ngIf="currentTab === 'polls'" slot="polls"></rtk-polls>
      <rtk-participants *ngIf="currentTab === 'participants'" slot="participants"></rtk-participants>
      <rtk-plugins *ngIf="currentTab === 'plugins'" slot="plugins"></rtk-plugins>
      <div *ngIf="currentTab === 'warnings'" slot="warnings" class="flex justify-center items-center">
        <div>Do not cheat in the exam</div>
      </div>
    </rtk-sidebar-ui>
  `
})
export class MeetingSidebarComponent implements OnInit, OnDestroy {
  states: States = {} as States;
  view: RtkSidebarView = 'sidebar';
  
  tabs = [
    { id: 'chat', name: 'chat' },
    { id: 'polls', name: 'polls' },
    { id: 'participants', name: 'participants' },
    { id: 'plugins', name: 'plugins' },
    { id: 'warnings', name: 'warnings' },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private statesService: StatesService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  get currentTab(): any {
    return this.states.sidebar;
  }

  ngOnInit() {
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

  onSidebarClose() {
    const rtkSidebarElement = this.document.querySelector('rtk-sidebar-ui') as HTMLElement;
    
    const eventPayload = {
      activeSidebar: false,
      sidebar: 'chat'
    };

    const stateUpdateEvent = new CustomEvent('rtkStateUpdate', {
      detail: eventPayload,
      bubbles: true,
      composed: true
    });

    rtkSidebarElement?.dispatchEvent(stateUpdateEvent);
  }
}
