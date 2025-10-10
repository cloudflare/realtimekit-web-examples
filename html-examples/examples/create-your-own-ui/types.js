// Type definitions for the application
window.Types = (function() {
  
  // CustomSideBarTabs type - extends RtkSidebarSection with 'warnings'
  // RtkSidebarSection values: 'chat', 'participants', 'plugins', 'polls'
  const CustomSideBarTabs = {
    CHAT: 'chat',
    PARTICIPANTS: 'participants', 
    PLUGINS: 'plugins',
    POLLS: 'polls',
    WARNINGS: 'warnings'
  };

  // CustomStates interface
  function createCustomStates(initialStates = {}) {
    return {
      activeMediaPreviewModal: false,
      ...initialStates
    };
  }

  return {
    CustomSideBarTabs,
    createCustomStates
  };
})();
