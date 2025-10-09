// Meeting Sidebar Component
window.MeetingSidebar = (function() {
  
  function create(container, meeting) {
    const { statesStore } = window.StatesStore;
    let stateUnsubscribe = null;
    let states = {};

    const tabs = [
      { id: 'chat', name: 'chat' },
      { id: 'polls', name: 'polls' },
      { id: 'participants', name: 'participants' },
      { id: 'plugins', name: 'plugins' },
      { id: 'warnings', name: 'warnings' },
    ];

    function render() {
      console.log('Sidebar render called with states:', states);
      console.log('Checking conditions - activeSidebar:', states.activeSidebar, 'sidebar:', states.sidebar);
      if (!states.activeSidebar || !states.sidebar) {
        console.log('Sidebar conditions not met, clearing container');
        container.innerHTML = '';
        return;
      }
      
      console.log('Sidebar conditions met, rendering sidebar');

      const currentTab = states.sidebar;
      const view = 'sidebar';
      
      console.log('Rendering sidebar with currentTab:', currentTab);

      container.innerHTML = `
        <rtk-sidebar-ui
          class="w-96 max-w-full rounded-xl"
          tabs='${JSON.stringify(tabs)}'
          current-tab="${currentTab}"
          view="${view}">
          
          ${currentTab === 'chat' ? '<rtk-chat slot="chat"></rtk-chat>' : ''}
          ${currentTab === 'polls' ? '<rtk-polls slot="polls"></rtk-polls>' : ''}
          ${currentTab === 'participants' ? '<rtk-participants slot="participants"></rtk-participants>' : ''}
          ${currentTab === 'plugins' ? '<rtk-plugins slot="plugins"></rtk-plugins>' : ''}
          ${currentTab === 'warnings' ? `
            <div slot="warnings" class="flex justify-center items-center h-full text-white">
              <div class="text-center p-4">
                <div class="text-lg font-semibold mb-2">⚠️ Warning</div>
                <div>Do not cheat in the exam</div>
              </div>
            </div>
          ` : ''}
        </rtk-sidebar-ui>
      `;
      
      console.log('Sidebar HTML rendered:', container.innerHTML);
    }

    function setupEventListeners() {
      const sidebarUi = container.querySelector('rtk-sidebar-ui');
      if (sidebarUi) {
        // Set tabs property
        sidebarUi.tabs = tabs;

        // Set up sidebar close event listener
        sidebarUi.addEventListener('sidebarClose', () => {
          const eventPayload = {
            activeSidebar: false,
            sidebar: 'chat'
          };

          const stateUpdateEvent = new CustomEvent('rtkStateUpdate', {
            detail: eventPayload,
            bubbles: true,
            composed: true
          });

          sidebarUi.dispatchEvent(stateUpdateEvent);
        });
      }
    }

    function updateSidebar() {
      render();
      setupEventListeners();
    }

    function init() {
      // Subscribe to states changes
      stateUnsubscribe = window.StatesStore.subscribe(statesStore, () => {
        const newStates = statesStore.states;
        const shouldUpdate = 
          newStates.activeSidebar !== states.activeSidebar ||
          newStates.sidebar !== states.sidebar;
        
        states = newStates;
        console.log('Sidebar states updated:', states);
        
        if (shouldUpdate) {
          updateSidebar();
        }
      });

      // Initial state and render
      states = statesStore.states;
      console.log('Initial sidebar states:', states);
      render();
      setupEventListeners();
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
