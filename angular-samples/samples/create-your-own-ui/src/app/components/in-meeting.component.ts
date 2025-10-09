import { Component } from '@angular/core';

@Component({
  selector: 'app-in-meeting',
  template: `
    <div class="flex flex-col w-full h-full">
      <header>
        <app-meeting-header></app-meeting-header>
      </header>
      <main class="flex w-full flex-1">
        <rtk-stage class="flex w-full flex-1 p-2">
          <rtk-grid></rtk-grid>
          <rtk-notifications></rtk-notifications>
          <app-meeting-sidebar></app-meeting-sidebar>
        </rtk-stage>
        <rtk-participants-audio></rtk-participants-audio>
      </main>
      <footer class="flex w-full overflow-visible">
        <app-meeting-control-bar></app-meeting-control-bar>
      </footer>
    </div>
  `
})
export class InMeetingComponent {}
