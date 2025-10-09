import {
  RtkClock,
  RtkGridPagination,
  RtkHeader,
  RtkLivestreamIndicator,
  RtkLogo,
  RtkMeetingTitle,
  RtkParticipantCount,
  RtkRecordingIndicator,
  RtkViewerCount,
} from '@cloudflare/realtimekit-react-ui';

function HeaderPreBuilt() {
  return <RtkHeader className="flex justify-between bg-black" />;
}

function HeaderWithCustomUI() {
  return (
    <div className="flex justify-between bg-black text-white">
      <div id="header-left" className="flex items-center h-[48px]">
        <RtkLogo />
        <RtkRecordingIndicator />
        <RtkLivestreamIndicator />
      </div>
      <div id="header-center" className="flex items-center h-[48px]">
        <RtkMeetingTitle />
      </div>
      <div id="header-right" className="flex items-center h-[48px]">
        <RtkGridPagination />
        <RtkParticipantCount />
        <RtkViewerCount />
        <RtkClock />
      </div>
    </div>
  );
}

export default HeaderPreBuilt; // uncomment if you want the pre built RealtimeKit header
// export default HeaderWithCustomUI; // uncomment if yoi want custom UI
