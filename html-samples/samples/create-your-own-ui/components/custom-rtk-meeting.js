// Custom RTK Meeting Component
window.CustomRtkMeeting = (function() {
  
  function create(container, meeting) {
    const { statesStore, customStatesStore } = window.StatesStore;
    let stateUnsubscribe = null;
    let customStateUnsubscribe = null;
    let states = {};
    let customStates = {};
    let currentComponent = null;
    let currentCleanup = null;

    function renderCurrentScreen() {
      // Clean up previous component
      if (currentCleanup) {
        currentCleanup();
        currentCleanup = null;
      }

      const meetingState = states.meeting || 'idle';
      console.log('Meeting state:', meetingState, 'States:', states, 'Custom states:', customStates);

      switch (meetingState) {
        case 'idle':
          container.innerHTML = '<rtk-idle-screen></rtk-idle-screen>';
          currentComponent = 'idle';
          break;
        case 'setup':
          if (window.SetupScreen) {
            currentCleanup = window.SetupScreen.create(container, meeting);
            currentComponent = 'setup';
          }
          break;
        case 'waiting':
          container.innerHTML = '<rtk-waiting-screen></rtk-waiting-screen>';
          currentComponent = 'waiting';
          break;
        case 'ended':
          container.innerHTML = '<rtk-ended-screen></rtk-ended-screen>';
          currentComponent = 'ended';
          break;
        case 'joined':
        default:
          if (window.InMeeting) {
            currentCleanup = window.InMeeting.create(container, meeting);
            currentComponent = 'joined';
          }
          break;
      }
    }

    function init() {
      // Subscribe to states changes
      stateUnsubscribe = window.StatesStore.subscribe(statesStore, () => {
        const newStates = statesStore.states;
        const shouldUpdate = newStates.meeting !== states.meeting;
        
        states = newStates;
        console.log('States subscription triggered, meeting state changed to:', states.meeting);
        
        if (shouldUpdate) {
          renderCurrentScreen();
        }
      });

      // Subscribe to custom states changes
      customStateUnsubscribe = window.StatesStore.subscribe(customStatesStore, () => {
        customStates = customStatesStore.states;
        console.log('Custom states updated:', customStates);
      });

      // Initial state and render
      states = statesStore.states;
      customStates = customStatesStore.states;
      console.log('Initial render with states:', states);
      renderCurrentScreen();
    }

    function cleanup() {
      if (stateUnsubscribe) {
        stateUnsubscribe();
      }
      if (customStateUnsubscribe) {
        customStateUnsubscribe();
      }
      if (currentCleanup) {
        currentCleanup();
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
