import { Component, ViewChild } from '@angular/core';
import { RtkMeeting } from '@cloudflare/realtimekit-angular-ui';
import RealtimeKitClient from '@cloudflare/realtimekit';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'default-meeting-ui';

  @ViewChild('meeting') $meetingEl!: RtkMeeting;

  async ngAfterViewInit() {
    const searchParams = new URL(window.location.href).searchParams;

    const authToken = searchParams.get('authToken');

    if (!authToken) {
      alert(
        "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting."
      );
      return;
    }

    const meeting = await RealtimeKitClient.init({
      authToken,
      baseURI: environment.baseUrl,
    });

    this.$meetingEl.meeting = meeting;
  }
}
