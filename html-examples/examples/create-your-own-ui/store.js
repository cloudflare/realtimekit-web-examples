// State management using simple reactive state
window.StatesStore = (function() {
  // Get initial states from RTK UI
  let initialStates = {};
  try {
    // This will be available after RTK UI loads
    if (window.RealtimeKitUI && window.RealtimeKitUI.getInitialStates) {
      initialStates = window.RealtimeKitUI.getInitialStates();
    }
  } catch (e) {
    console.warn('Initial states not available yet, using empty object');
  }

  // Create reactive states
  const statesReactive = window.createReactiveState({
    states: initialStates
  });

  const customStatesReactive = window.createReactiveState({
    states: {}
  });

  // Add methods to the reactive states
  statesReactive.state.setStates = function(newStates) {
    console.log('Setting states:', newStates);
    this.states = { ...this.states, ...newStates };
  };

  customStatesReactive.state.setCustomStates = function(newStates) {
    console.log('Setting custom states:', newStates);
    this.states = { ...this.states, ...newStates };
  };

  return {
    statesStore: statesReactive.state,
    customStatesStore: customStatesReactive.state,
    subscribe: function(target, callback) {
      if (target === statesReactive.state) {
        return statesReactive.subscribe(callback);
      } else if (target === customStatesReactive.state) {
        return customStatesReactive.subscribe(callback);
      }
    }
  };
})();
