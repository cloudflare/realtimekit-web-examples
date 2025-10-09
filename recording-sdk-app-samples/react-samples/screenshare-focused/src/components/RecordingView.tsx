import { RtkAvatar, RtkParticipantsAudio, RtkParticipantTile, RtkScreenshareView } from "@cloudflare/realtimekit-react-ui";
import { useRealtimeKitMeeting, useRealtimeKitSelector } from "@cloudflare/realtimekit-react";
import { useState } from "react";

export default function RecordingView() {
    const { meeting } = useRealtimeKitMeeting();

    const [size] = useState({ height: '120px', width: '120px' });

    const activeParticipants = useRealtimeKitSelector((meeting) =>
        meeting.participants.active.toArray()
    );

    const pinnedParticipants = useRealtimeKitSelector((meeting) =>
        meeting.participants.pinned.toArray()
    );

    const screensharedParticipants = useRealtimeKitSelector((meeting) =>
        meeting.participants.joined.toArray().filter((p) => p.screenShareEnabled)
    );

    // show pinned participants first
    const participants = [
        ...pinnedParticipants,
        ...activeParticipants.filter((p) => !pinnedParticipants.includes(p)),
    ];

    const hasScreenshare = screensharedParticipants.length > 0;

    return (<main
        style={{
            display: "flex",
            position: "relative",
            paddingTop: "0rem",
            flexWrap: "wrap",
            flexShrink: "0",
            justifyContent: "center",
            alignContent: "center",
            width: "100vw",
            height: "100vh"
        }}
    >
        {hasScreenshare && (
            <RtkScreenshareView
                meeting={meeting}
                participant={screensharedParticipants[0]}
                hideFullScreenButton={true}
            />
        )}
        <div
            style={{
                height: `calc(${size.height} + 1.25rem)`,
                display: "flex",
                position: "fixed",
                bottom: "0",
                zIndex: "10",
                paddingLeft: "2.5rem",
                paddingRight: "2.5rem",
                verticalAlign: "middle",
                justifyContent: "flex-start",
                width: "100%",
                gap: "1rem",
                marginLeft:"2rem"
            }}
        >
            {participants.map((participant) => {
                return (
                    <div
                        key={participant.id}
                        style={{ ...size, borderRadius: "9999px" }}
                    >
                        <RtkParticipantTile
                            participant={participant}
                            key={participant.id}
                            style={{
                                ...size,
                                transitionProperty: "all",
                                borderRadius: "9999px",
                                borderWidth: "1px",
                            }}
                        >
                            <RtkAvatar participant={participant} />
                        </RtkParticipantTile>
                    </div>
                );
            })}
        </div>
        <RtkParticipantsAudio meeting={meeting} />
    </main>)
}