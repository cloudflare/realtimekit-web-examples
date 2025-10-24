# Back to Back Meetings

A example designed for continuous meeting workflows where participants need to transition seamlessly from one meeting to the next without interruption. Perfect for scenarios like back-to-back appointments, consecutive interviews, or sequential consultations.

## Features

- **Continuous Meeting Flow**: Automatically transitions from one meeting to the next
- **Single Meeting Display**: Focus on one meeting at a time
- **Zero Manual Joins**: No need to manually join meetings - transitions happen automatically
- **Session Complete Screen**: Shows completion message with option to restart the meeting cycle
- **Room Left Event Integration**: Uses `meeting.self.on('roomLeft')` to trigger automatic transitions
- **State Isolation**: Each meeting maintains its own isolated state using Zustand stores
- **UI Addons**: Includes video backgrounds, hand raise, and host controls

## How It Works

1. **First Meeting**: Automatically begins when the first meeting token is provided
2. **Seamless Transition**: When one meeting ends, the next meeting automatically starts
3. **Continuous Workflow**: Designed for scenarios requiring uninterrupted meeting sequences
4. **Session Complete**: After all scheduled meetings, shows completion screen with restart option

## Usage

Pass auth tokens via URL parameters:
```
?authToken1=<first-meeting-token>&authToken2=<second-meeting-token>
```

### Parameters
- `authToken1` (required): Token for the first meeting
- `authToken2` (optional): Token for the second meeting

## Architecture

- **App.tsx**: Main component handling meeting state and transitions
- **Meeting.tsx**: Individual meeting component with addons and event handling  
- **store.ts**: Zustand-based state management with per-meeting isolation
- **components/**: Custom RTK UI components for meeting display
