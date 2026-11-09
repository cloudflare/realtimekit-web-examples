import { Component, ViewChild } from '@angular/core';
import { RtkMeeting } from '@cloudflare/realtimekit-angular-ui';
import RealtimeKitClient from '@cloudflare/realtimekit';
import { RealtimeKitNoiseCancellation } from '@cloudflare/realtimekit-noise-cancellation';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'with-noise-cancellation';

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

    const baseURI = searchParams.get('baseURI') || environment.baseUrl;
    const logInConsole = searchParams.get('logInConsole') === 'true';

    const meeting = await RealtimeKitClient.init({
      authToken,
      baseURI,
      modules: { devTools: { logs: logInConsole } },
    });

    Object.assign(window, { meeting });

    this.$meetingEl.meeting = meeting;

    // Enables automatically when the mic is available, without delaying join.
    void RealtimeKitNoiseCancellation.init({ meeting }).catch(console.warn);
  }
}
