# Create Your Own UI Sample

This sample demonstrates how to create a custom meeting UI using Cloudflare RealtimeKit with vanilla HTML, CSS, and JavaScript. It showcases custom components for setup screen, in-meeting experience, control bar, sidebar, and media preview functionality.

## Features

- **Custom Setup Screen**: Participant preview with media settings
- **Media Preview Modal**: Audio and video device selection with preview
- **Custom Control Bar**: Meeting controls with custom sidebar toggle
- **Custom Sidebar**: Standard tabs (chat, participants, polls, plugins) plus custom "warnings" tab
- **Custom Meeting Header**: Logo, indicators, meeting title, and controls
- **Responsive Design**: Built with Tailwind CSS for modern UI
- **State Management**: Uses simple reactive state implementation
- **No Build Steps**: Pure HTML/CSS/JS implementation

## Getting Started

### Prerequisites

- A valid Cloudflare RealtimeKit auth token
- A local web server (like `serve` or `live-server`)

### Installation

1. Clone or download this repository
2. Navigate to the `html-samples` directory
3. Install dependencies (optional, for development server):
   ```bash
   npm install
   ```

### Running the Sample

1. Start a local server:
   ```bash
   npx serve samples/create-your-own-ui
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000/?authToken=<your-auth-token>
   ```

   Replace `<your-auth-token>` with your actual Cloudflare RealtimeKit auth token.

## Project Structure

```
create-your-own-ui/
├── index.html                 # Main HTML file
├── store.js                   # Simple reactive state management
├── utils.js                   # Utility functions
├── types.js                   # Type definitions
├── components/                # Component files
│   ├── setup-screen.js/css    # Custom setup screen
│   ├── custom-rtk-meeting.js/css # Main meeting wrapper
│   ├── in-meeting.js/css      # In-meeting layout
│   ├── meeting-header.js/css  # Meeting header
│   ├── meeting-control-bar.js/css # Control bar
│   ├── meeting-sidebar.js/css # Custom sidebar
│   ├── media-preview-modal.js/css # Media preview
│   ├── audio-preview.js/css   # Audio device preview
│   └── video-preview.js/css   # Video device preview
└── README.md                  # This file
```

## Key Components

### Setup Screen
- Participant tile with avatar and name tag
- Audio visualizer
- Mic/camera toggles
- Media preview modal access
- Name editing (if permitted)
- Join button

### Media Preview Modal
- Tabbed interface for audio/video settings
- Device selection dropdowns
- Audio visualizer for microphone
- Video preview tile
- Speaker test functionality

### Control Bar
- Left: Fullscreen, settings, screen share
- Center: Mic, camera, stage, leave, more menu
- Right: Chat, polls, participants, plugins, custom sidebar toggle

### Custom Sidebar
- Standard RTK tabs: chat, participants, polls, plugins
- Custom "warnings" tab with example content
- Responsive design

## Customization

### Adding New Components
1. Create `.js` and `.css` files in the `components/` directory
2. Add script and link tags to `index.html`
3. Implement the component using the module pattern
4. Ensure proper cleanup in the component's cleanup function

### State Management
- Use `window.StatesStore.statesStore` for RTK states
- Use `window.StatesStore.customStatesStore` for custom states
- Subscribe to state changes using `window.StatesStore.subscribe()`

### Styling
- Uses Tailwind CSS via CDN
- Component-specific styles in individual CSS files
- Dark theme with consistent color scheme

## Dependencies

- **Cloudflare RealtimeKit**: Core meeting functionality
- **Cloudflare RealtimeKit UI**: Pre-built UI components
- **Simple Reactive State**: Custom reactive state implementation
- **Tailwind CSS**: Utility-first CSS framework

All dependencies are loaded via CDN, no build process required.

## Browser Support

This sample works in modern browsers that support:
- ES6 modules
- Custom elements
- WebRTC
- Modern CSS features

## Troubleshooting

### Common Issues

1. **Auth Token Error**: Ensure you're passing a valid `authToken` in the URL
2. **Components Not Loading**: Check browser console for script loading errors
3. **State Not Updating**: Verify reactive state subscriptions are properly set up
4. **Media Devices**: Ensure browser permissions for camera/microphone access

### Debug Mode

The meeting object is exposed on `window.meeting` for debugging purposes. Open browser dev tools and inspect the meeting object to troubleshoot issues.

### State Subscription Issues

If components aren't updating when states change, ensure you're subscribing to the store object, not the nested states:
- ✅ `window.StatesStore.subscribe(statesStore, callback)`
- ❌ `window.StatesStore.subscribe(statesStore.states, callback)`

## License

This sample is provided as-is for demonstration purposes.
