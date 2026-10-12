import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import type { AfterViewInit } from '@angular/core';
import {
  defaultIconPack,
  registerAddons,
} from '@cloudflare/realtimekit-angular-ui';
import type { States } from '@cloudflare/realtimekit-angular-ui';
import RealtimeKitClient from '@cloudflare/realtimekit';
import CustomControlbarButton from '@cloudflare/realtimekit-ui-addons/custom-controlbar-button';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements AfterViewInit {
  @ViewChild('meetingUI', { read: ElementRef })
  private meetingElement?: ElementRef<HTMLRtkMeetingElement>;

  meeting?: RealtimeKitClient;
  subscriptionsOpen = false;

  constructor(private readonly zone: NgZone) {}

  ngAfterViewInit(): void {
    this.initMeeting().catch((cause: unknown) => {
      console.error('Unable to initialize the meeting', cause);
    });
  }

  closeDialog(): void {
    this.zone.run(() => {
      this.subscriptionsOpen = false;
    });
  }

  handleMeetingStateChange(states: States): void {
    if (states.meeting && states.meeting !== 'joined') this.closeDialog();
  }

  private async initMeeting(): Promise<void> {
    const meetingElement = this.meetingElement?.nativeElement;
    if (!meetingElement) return;

    // Mount before initialization so preset loading precedes the addon config.
    await meetingElement.componentOnReady();
    const searchParams = new URL(window.location.href).searchParams;
    const authToken = searchParams.get('authToken');
    if (!authToken) {
      alert(
        "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting."
      );
      return;
    }
    const baseURI = searchParams.get('baseURI') || environment.baseUrl;
    const logInConsole = searchParams.get('logInConsole') === 'true';

    const meeting = await RealtimeKitClient.init({
      authToken,
      baseURI,
      modules: { devTools: { logs: logInConsole } },
    });
    const subscriptionsButton = new CustomControlbarButton({
      position: 'left',
      label: 'Subscriptions',
      icon: defaultIconPack.people_checked,
      onClick: () => {
        this.zone.run(() => {
          this.subscriptionsOpen = true;
        });
      },
      attributes: { 'aria-haspopup': 'dialog' },
    });

    meetingElement.meeting = meeting;
    meetingElement.config = registerAddons([subscriptionsButton], meeting);
    this.meeting = meeting;
  }
}
