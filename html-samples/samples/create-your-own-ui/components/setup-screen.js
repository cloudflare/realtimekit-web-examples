// Setup Screen Component
window.SetupScreen = (function() {
  
  function create(container, meeting) {
    const { customStatesStore } = window.StatesStore;
    let participantName = meeting?.self?.name || '';
    let stateUnsubscribe = null;
    let customStates = {};

    // Create the component HTML
    function render() {
      const canEditName = meeting?.self?.permissions?.canEditDisplayName;
      
      container.innerHTML = `
        <div class="flex justify-around w-full h-full p-[5%] bg-black text-white">
          <div class="flex justify-around w-full h-full p-[5%]">
            <rtk-participant-tile id="setup-participant-tile">
              <rtk-avatar></rtk-avatar>
              <rtk-name-tag>
                <rtk-audio-visualizer slot="start"></rtk-audio-visualizer>
              </rtk-name-tag>
              <div id="user-actions" class="absolute flex bottom-2 right-2">
                <rtk-mic-toggle size="sm"></rtk-mic-toggle>
                <rtk-camera-toggle size="sm"></rtk-camera-toggle>
              </div>
              <div class="absolute top-2 right-2">
                <rtk-controlbar-button id="media-preview-btn" label="Media Preview">
                </rtk-controlbar-button>
              </div>
            </rtk-participant-tile>
            <div class="h-1/2 w-1/4 flex flex-col justify-between">
              <div class="flex flex-col items-center">
                <p>Joining as</p>
                <div id="participant-display-name">${participantName}</div>
              </div>
              <input
                id="participant-name-input"
                placeholder="Your name"
                class="bg-[#141414] rounded-sm border-[#EEEEEE] focus:border-[#2160FD] p-2.5 mb-10"
                value="${participantName}"
                ${!canEditName ? 'style="display: none;"' : ''}
              />
              <rtk-button id="join-btn" kind="wide" size="lg">
                Join
              </rtk-button>
            </div>
            <div id="media-preview-modal-container"></div>
          </div>
        </div>
      `;
    }

    function setupEventListeners() {
      // Set up participant tile
      const participantTile = container.querySelector('#setup-participant-tile');
      if (participantTile && meeting?.self) {
        participantTile.participant = meeting.self;
      }

      // Set up avatar
      const avatar = container.querySelector('rtk-avatar');
      if (avatar && meeting?.self) {
        avatar.participant = meeting.self;
      }

      // Set up name tag
      const nameTag = container.querySelector('rtk-name-tag');
      if (nameTag && meeting?.self) {
        nameTag.participant = meeting.self;
      }

      // Set up audio visualizer
      const audioVisualizer = container.querySelector('rtk-audio-visualizer');
      if (audioVisualizer && meeting?.self) {
        audioVisualizer.participant = meeting.self;
      }

      // Set up media preview button with settings icon
      const mediaPreviewBtn = container.querySelector('#media-preview-btn');
      if (mediaPreviewBtn) {
        // Try to get the settings icon from RTK UI
        try {
          if (window.RealtimeKitUI && window.RealtimeKitUI.defaultIconPack) {
            mediaPreviewBtn.icon = window.RealtimeKitUI.defaultIconPack.settings;
          }
        } catch (e) {
          console.warn('Could not set settings icon:', e);
        }
        
        mediaPreviewBtn.addEventListener('click', () => {
          console.log('Media preview button clicked');
          customStatesStore.setCustomStates({
            activeMediaPreviewModal: true
          });
        });
      }

      // Set up name input
      const nameInput = container.querySelector('#participant-name-input');
      if (nameInput) {
        nameInput.addEventListener('input', (e) => {
          participantName = e.target.value;
          const displayName = container.querySelector('#participant-display-name');
          if (displayName) {
            displayName.textContent = participantName;
          }
          
          // Update join button state
          const joinBtn = container.querySelector('#join-btn');
          if (joinBtn) {
            joinBtn.style.cursor = participantName ? 'pointer' : 'not-allowed';
          }
        });
      }

      // Set up join button
      const joinBtn = container.querySelector('#join-btn');
      if (joinBtn) {
        joinBtn.style.cursor = participantName ? 'pointer' : 'not-allowed';
        joinBtn.addEventListener('click', async () => {
          if (participantName && meeting) {
            if (meeting.self.permissions.canEditDisplayName) {
              meeting.self.setName(participantName);
            }
            await meeting.join();
          }
        });
      }
    }

    function updateMediaPreviewModal() {
      const modalContainer = container.querySelector('#media-preview-modal-container');
      console.log('updateMediaPreviewModal called:', {
        modalContainer: !!modalContainer,
        activeModal: customStates.activeMediaPreviewModal,
        MediaPreviewModal: !!window.MediaPreviewModal
      });
      
      if (modalContainer) {
        if (customStates.activeMediaPreviewModal) {
          // Create media preview modal if it doesn't exist
          if (!modalContainer.querySelector('.media-preview-modal')) {
            console.log('Creating media preview modal');
            window.MediaPreviewModal.create(modalContainer, meeting, true);
          }
        } else {
          // Remove modal if it exists
          modalContainer.innerHTML = '';
        }
      }
    }

    function init() {
      render();
      setupEventListeners();

      // Subscribe to custom states changes for modal
      stateUnsubscribe = window.StatesStore.subscribe(customStatesStore, () => {
        customStates = customStatesStore.states;
        console.log('Custom states subscription triggered:', customStates);
        updateMediaPreviewModal();
      });

      // Initial modal state
      customStates = customStatesStore.states;
      updateMediaPreviewModal();
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
