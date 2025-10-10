import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { StatesService, CustomStatesService } from '../services/states.service';
import { States } from '@cloudflare/realtimekit-ui';
import { CustomStates } from '../types';

@Component({
  selector: 'app-custom-rtk-meeting',
  template: `
    <rtk-idle-screen *ngIf="states.meeting === 'idle'"></rtk-idle-screen>
    <app-setup-screen *ngIf="states.meeting === 'setup'"></app-setup-screen>
    <rtk-waiting-screen *ngIf="states.meeting === 'waiting'"></rtk-waiting-screen>
    <rtk-ended-screen *ngIf="states.meeting === 'ended'"></rtk-ended-screen>
    <app-in-meeting *ngIf="states.meeting === 'joined' || !states.meeting"></app-in-meeting>
  `
})
export class CustomRtkMeetingComponent implements OnInit, OnDestroy {
  states: States = { meeting: 'idle' } as States;
  customStates: CustomStates = {};
  private destroy$ = new Subject<void>();

  constructor(
    private statesService: StatesService,
    private customStatesService: CustomStatesService
  ) {}

  ngOnInit() {
    this.statesService.states$
      .pipe(takeUntil(this.destroy$))
      .subscribe(states => {
        this.states = states;
        console.log(states, this.customStates);
      });

    this.customStatesService.customStates$
      .pipe(takeUntil(this.destroy$))
      .subscribe(customStates => {
        this.customStates = customStates;
        console.log(this.states, customStates);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
