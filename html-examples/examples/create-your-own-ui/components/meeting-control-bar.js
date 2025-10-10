// Meeting Control Bar Component
window.MeetingControlBar = (function() {
  
  function create(container, meeting) {
    const { statesStore } = window.StatesStore;
    let stateUnsubscribe = null;
    let states = {};

    function render() {
      const fullScreenTargetElement = document.querySelector('#app');

      container.innerHTML = `
        <div class="flex w-full py-2 px-3 text-white justify-between">
          <div
            id="controlbar-left"
            class="flex items-center overflow-visible justify-center"
          >
            <rtk-fullscreen-toggle id="fullscreen-toggle"></rtk-fullscreen-toggle>
            <rtk-settings-toggle></rtk-settings-toggle>
            <rtk-screen-share-toggle></rtk-screen-toggle>
          </div>
          <div
            id="controlbar-center"
            class="flex items-center overflow-visible justify-center"
          >
            <rtk-mic-toggle></rtk-mic-toggle>
            <rtk-camera-toggle></rtk-camera-toggle>
            <rtk-stage-toggle></rtk-stage-toggle>
            <rtk-leave-button></rtk-leave-button>
            <rtk-more-toggle>
              <div slot="more-elements">
                <rtk-pip-toggle variant="horizontal"></rtk-pip-toggle>
                <rtk-mute-all-button variant="horizontal"></rtk-mute-all-button>
                <rtk-breakout-rooms-toggle variant="horizontal"></rtk-breakout-rooms-toggle>
                <rtk-recording-toggle variant="horizontal"></rtk-recording-toggle>
              </div>
            </rtk-more-toggle>
          </div>
          <div
            id="controlbar-right"
            class="flex items-center overflow-visible justify-center"
          >
            <rtk-chat-toggle></rtk-chat-toggle>
            <rtk-polls-toggle></rtk-polls-toggle>
            <rtk-participants-toggle></rtk-participants-toggle>
            <rtk-plugins-toggle></rtk-plugins-toggle>
            <rtk-controlbar-button
              id="custom-sidebar-btn"
              label="Open Custom Sidebar">
            </rtk-controlbar-button>
          </div>
        </div>`;
    }

    function setupEventListeners() {
      // Set up fullscreen toggle target element
      const fullscreenToggle = container.querySelector('#fullscreen-toggle');
      if (fullscreenToggle) {
        const targetElement = document.querySelector('#app');
        if (targetElement) {
          fullscreenToggle.targetElement = targetElement;
        }
      }

      // Set up custom sidebar button
      const customSidebarBtn = container.querySelector('#custom-sidebar-btn');
      if (customSidebarBtn) {
        // Set the add icon
        try {
          if (window.RealtimeKitUI && window.RealtimeKitUI.defaultIconPack) {
            customSidebarBtn.icon = window.RealtimeKitUI.defaultIconPack.add;
          }
        } catch (e) {
          console.warn('Could not set add icon:', e);
        }

        customSidebarBtn.addEventListener('click', (e) => {
          console.log('Custom sidebar button clicked, current states:', states);
          
          // Update states directly through the store
          if (window.StatesStore && window.StatesStore.statesStore) {
            const newActiveSidebar = states.sidebar !== 'warnings' ? true : !states.activeSidebar;
            console.log('Setting sidebar state:', { activeSidebar: newActiveSidebar, sidebar: 'warnings' });
            
            window.StatesStore.statesStore.setStates({
              activeSidebar: newActiveSidebar,
              sidebar: 'warnings',
            });
          }
        });
      }
    }

    function init() {
      render();
      setupEventListeners();

      // Subscribe to states changes
      stateUnsubscribe = window.StatesStore.subscribe(statesStore, () => {
        states = statesStore.states;
        // Re-render when states change to avoid duplicates
        render();
        setupEventListeners();
      });

      // Initial state
      states = statesStore.states;
    }

    function cleanup() {
      if (stateUnsubscribe) {
        stateUnsubscribe();
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
