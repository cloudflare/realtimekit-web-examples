import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { StatesService } from './services/states.service';
import RealtimeKitClient from '@cloudflare/realtimekit';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  meeting: any = null;

  constructor(
    private statesService: StatesService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  async ngOnInit() {
    await this.initializeMeeting();
  }

  private async initializeMeeting() {
    const searchParams = new URLSearchParams(this.document.defaultView?.location.search);
    const authToken = searchParams.get('authToken');

    if (!authToken) {
      alert(
        "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting."
      );
      return;
    }

    if (!this.meeting) {
      try {
        // Initialize RealtimeKit client
        const meeting = await RealtimeKitClient.init({
          authToken,
        });

        this.meeting = meeting;

        // Expose meeting object to window for debugging
        Object.assign(this.document.defaultView as any, {
          meeting: this.meeting,
        });

      } catch (error) {
        console.error('Failed to initialize meeting:', error);
      }
    }
  }

  onRtkStatesUpdate(event: any) {
    this.statesService.setStates(event.detail);
  }
}
