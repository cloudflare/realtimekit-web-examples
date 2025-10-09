// Meeting Header Component
window.MeetingHeader = (function() {
  
  function create(container, meeting) {
    function render() {
      container.innerHTML = `
        <div class="flex justify-between bg-black text-white">
          <div id="header-left" class="flex items-center h-[48px]">
            <rtk-logo></rtk-logo>
            <rtk-recording-indicator></rtk-recording-indicator>
            <rtk-livestream-indicator></rtk-livestream-indicator>
          </div>
          <div id="header-center" class="flex items-center h-[48px]">
            <rtk-meeting-title></rtk-meeting-title>
          </div>
          <div id="header-right" class="flex items-center h-[48px]">
            <rtk-grid-pagination></rtk-grid-pagination>
            <rtk-participant-count></rtk-participant-count>
            <rtk-viewer-count></rtk-viewer-count>
            <rtk-clock></rtk-clock>
          </div>
        </div>
      `;
    }

    function init() {
      render();
    }

    function cleanup() {
      container.innerHTML = '';
    }

    init();
    return cleanup;
  }

  return {
    create
  };
})();
