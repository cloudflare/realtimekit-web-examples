import { Component, ViewChild } from '@angular/core';
import { RtkMeeting, registerAddons } from '@cloudflare/realtimekit-angular-ui';
import RealtimeKitClient from '@cloudflare/realtimekit';
import VideoBackground from '@cloudflare/realtimekit-ui-addons/video-background';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'with-video-transformer';

  @ViewChild('meeting') $meetingEl!: RtkMeeting;

  async ngAfterViewInit() {
    const searchParams = new URL(window.location.href).searchParams;

    const authToken = searchParams.get('authToken');

    console.log({ authToken });

    if (!authToken) {
      alert(
        "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting."
      );
      return;
    }

    const meeting = await RealtimeKitClient.init({
      authToken,
    });

    this.$meetingEl.meeting = meeting;

    const videoBackground = await VideoBackground.init({
      modes: ["blur", "virtual", "random"],
      blurStrength: 30, // 0 - 100 for opacity
      meeting: meeting!,
      images: [
          "https://images.unsplash.com/photo-1487088678257-3a541e6e3922?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3",
          "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3",
          "https://images.unsplash.com/photo-1600431521340-491eca880813?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3"
      ],
      randomCount: 10,
    });

    const newConfig = registerAddons([videoBackground], meeting);

    this.$meetingEl.config = newConfig;
  }
}
