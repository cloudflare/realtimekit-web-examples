import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import RealtimeKitClient from '@cloudflare/realtimekit';
import { RealtimeKitRecording } from '@cloudflare/realtimekit-recording-sdk';
import { generateConfig, provideRtkDesignSystem, UIConfig } from '@cloudflare/realtimekit-ui';
import { MeetingConfig } from '../types';

const defaultUIConfig: any = {
  designTokens: {
    borderRadius: 'rounded',
    borderWidth: 'thin',
    spacingBase: 4,
    theme: 'dark',
    logo: '',
    colors: {
      brand: {
        '300': '#023dd0',
        '400': '#0248f5',
        '500': '#2160fd',
        '600': '#3e75fd',
        '700': '#5c8afe',
      },
      background: {
        '600': '#222222',
        '700': '#1f1f1f',
        '800': '#1b1b1b',
        '900': '#181818',
        '1000': '#141414',
      },
      danger: '#FF2D2D',
      text: '#EEEEEE',
      'text-on-brand': '#EEEEEE',
      success: '#62A504',
      'video-bg': '#191919',
      warning: '#FFCD07',
    },
  },
};

@Component({
  selector: 'app-recording-view',
  templateUrl: './recording-view.component.html',
  styleUrls: ['./recording-view.component.css'],
})
export class RecordingViewComponent implements OnInit {
  @Input() authToken!: string;
  @Input() config!: MeetingConfig;
  @Input() baseURI!: string | null;

  @ViewChild('gridContainer', { static: false }) gridContainer!: ElementRef;

  client: RealtimeKitClient | null = null;
  uiconfig: UIConfig | null = null;
  overrides: any = {};
  loading = true;

  ngOnInit() {
    this.initMeeting();
  }

  private async initMeeting() {
    if (!this.authToken) {
      return;
    }

    const recordingSDK = new RealtimeKitRecording({});
    const meetingObj = await RealtimeKitClient.init({
      authToken: this.authToken,
      defaults: {
        audio: false,
        video: false,
      },
      baseURI: this.baseURI ?? 'realtime.cloudflare.com',
    });

    await recordingSDK.init(meetingObj);
    this.client = meetingObj;

    this.setupUIConfig();
  }

  private setupUIConfig() {
    if (!this.client) {
      return;
    }

    const uiKitConfig = { ...defaultUIConfig } as UIConfig;

    if (
      this.config.videoUnsubscribePresetsRegex &&
      this.config.videoUnsubscribePresetsRegex.length > 0
    ) {
      console.log('subscription override', this.config.videoUnsubscribePresetsRegex);
      this.overrides = {
        videoUnsubscribed: { preset: this.config.videoUnsubscribePresetsRegex },
      };
    }

    if (uiKitConfig.root) {
      uiKitConfig.root['rtk-mixed-grid'] = {
        states: ['activeSpotlight'],
        children: [['rtk-simple-grid', { style: { width: '15%' } }]],
      };

      uiKitConfig.root['rtk-mixed-grid.activeSpotlight'] = [
        ['rtk-spotlight-grid', { style: { width: '15%' }, layout: 'column' }],
      ];
    }

    this.uiconfig = uiKitConfig;
    this.loading = false;

    // Apply design system after view updates
    setTimeout(() => {
      if (
        this.gridContainer?.nativeElement &&
        this.uiconfig?.designTokens
      ) {
        provideRtkDesignSystem(
          this.gridContainer.nativeElement,
          this.uiconfig.designTokens
        );
      }
    });
  }
}
