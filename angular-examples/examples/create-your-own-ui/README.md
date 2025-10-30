# Create Your Own UI

This example showcases how to create your own UI using Cloudflare RealtimeKit's Angular UI Kit and other packages.

## How to run?

1. Run `npm install` in the current [folder](./)
2. Run `npm run dev` to start a server. See the port in the logs of this command. Default is 4200.
3. Open browser with the URL `http://localhost:4200/?authToken=PUT_PARTICIPANT_AUTH_TOKEN_HERE`. Change the port if needed.

To learn more, refer to [the source code](./src/app/app.component.ts)

## Architecture

This Angular example is equivalent to the Cloudflare RealtimeKit `create-your-own-ui` example and includes:

### Components
- **CustomRtkMeetingComponent**: Main meeting component that handles different meeting states
- **SetupScreenComponent**: Custom setup screen with media preview functionality
- **InMeetingComponent**: Main meeting interface with header, stage, and control bar
- **MeetingHeaderComponent**: Custom header with meeting info and controls
- **MeetingControlBarComponent**: Custom control bar with meeting controls
- **MeetingSidebarComponent**: Custom sidebar with chat, participants, and custom tabs
- **MediaPreviewModalComponent**: Modal for audio/video device preview and settings
- **AudioPreviewComponent**: Audio device selection and testing
- **VideoPreviewComponent**: Video device selection and preview

### Services
- **StatesService**: Manages Cloudflare RealtimeKit UI states
- **CustomStatesService**: Manages custom application states

### Features
- **Tailwind CSS**: For styling and responsive design
- **Custom UI Components**: All components use Cloudflare RealtimeKit Angular UI components
- **State Management**: Angular services for state management
- **Device Management**: Audio/video device selection and preview
- **Custom Sidebar**: Example of extending the sidebar with custom tabs
