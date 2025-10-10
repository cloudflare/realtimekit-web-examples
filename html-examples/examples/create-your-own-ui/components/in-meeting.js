// In Meeting Component
window.InMeeting = (function() {
  
  function create(container, meeting) {
    let headerCleanup = null;
    let controlBarCleanup = null;
    let sidebarCleanup = null;

    function render() {
      container.innerHTML = `
        <div class="flex flex-col w-full h-full">
          <header>
            <div id="meeting-header-container"></div>
          </header>
          <main class="flex w-full flex-1">
            <rtk-stage class="flex w-full flex-1 p-2" style="display: flex; width: 100%; flex: 1; min-width: 100vw;">
              <rtk-grid style="flex-1"></rtk-grid>
              <rtk-notifications></rtk-notifications>
              <div id="meeting-sidebar-container"></div>
            </rtk-stage>
            <rtk-participants-audio></rtk-participants-audio>
          </main>
          <footer class="flex w-full overflow-visible">
            <div id="meeting-control-bar-container" class="w-full"></div>
          </footer>
        </div>
      `;
    }

    function setupComponents() {
      // Create header component
      const headerContainer = container.querySelector('#meeting-header-container');
      if (headerContainer && window.MeetingHeader) {
        headerCleanup = window.MeetingHeader.create(headerContainer, meeting);
      }

      // Create control bar component
      const controlBarContainer = container.querySelector('#meeting-control-bar-container');
      if (controlBarContainer && window.MeetingControlBar) {
        controlBarCleanup = window.MeetingControlBar.create(controlBarContainer, meeting);
      }

      // Create sidebar component
      const sidebarContainer = container.querySelector('#meeting-sidebar-container');
      if (sidebarContainer && window.MeetingSidebar) {
        sidebarCleanup = window.MeetingSidebar.create(sidebarContainer, meeting);
      }
    }

    function init() {
      render();
      setupComponents();
    }

    function cleanup() {
      if (headerCleanup) {
        headerCleanup();
      }
      if (controlBarCleanup) {
        controlBarCleanup();
      }
      if (sidebarCleanup) {
        sidebarCleanup();
      }
      container.innerHTML = '';
    }

    init();
    return cleanup;
  }

  return {
    create
  };
})();
