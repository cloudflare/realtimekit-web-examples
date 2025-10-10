import { RtkSpinner } from '@cloudflare/realtimekit-react-ui';

function  MeetingLoading() {
    /**
         * NOTE(ravindra-dyte): Don't like the default spinner?
         * You can replace RtkSpinner with your own screen, here.
         */
    return <RtkSpinner />;
}

export default MeetingLoading;