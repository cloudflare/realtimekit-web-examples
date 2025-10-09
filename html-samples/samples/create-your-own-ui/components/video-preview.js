// Video Preview Component
window.VideoPreview = (function() {
  
  function create(container, meeting) {
    let videoDevices = [];
    let currentDevices = {};
    let deviceListUpdateCallback = null;

    function render() {
      let unnamedCameraCount = 0;
      const videoEnabled = meeting?.self?.videoEnabled;

      container.innerHTML = `
        <div class="flex flex-col p-4">
          <div class="mb-4">
            ${videoEnabled ? `
              <rtk-participant-tile id="video-preview-tile" is-preview="true">
              </rtk-participant-tile>
            ` : `
              <rtk-participant-tile id="video-preview-tile-off">
                <div class="flex flex-col items-center justify-center h-48 bg-[#1F1F1F] rounded">
                  <rtk-icon id="video-off-icon" class="mb-2"></rtk-icon>
                  <div>Camera Off</div>
                </div>
              </rtk-participant-tile>
            `}
          </div>
          <div>
            <label class="block mb-2">Camera</label>
            <div>
              <select
                id="video-device-select"
                class="mt-2 w-full text-ellipsis bg-[#1F1F1F] p-2 text-white">
                ${videoDevices.map(({ deviceId, label }) => `
                  <option
                    value="${deviceId}"
                    ${currentDevices.video?.deviceId === deviceId ? 'selected' : ''}>
                    ${label || `Camera ${++unnamedCameraCount}`}
                  </option>
                `).join('')}
              </select>
            </div>
          </div>
        </div>
      `;
    }

    function setupEventListeners() {
      // Set up participant tiles
      const videoTile = container.querySelector('#video-preview-tile');
      const videoTileOff = container.querySelector('#video-preview-tile-off');
      
      if (videoTile && meeting?.self) {
        videoTile.participant = meeting.self;
      }
      if (videoTileOff && meeting?.self) {
        videoTileOff.participant = meeting.self;
      }

      // Set up video off icon
      const videoOffIcon = container.querySelector('#video-off-icon');
      if (videoOffIcon) {
        try {
          if (window.RealtimeKitUI && window.RealtimeKitUI.defaultIconPack) {
            videoOffIcon.icon = window.RealtimeKitUI.defaultIconPack.video_off;
          }
        } catch (e) {
          console.warn('Could not set video off icon:', e);
        }
      }

      // Set up device selector
      const videoSelect = container.querySelector('#video-device-select');
      if (videoSelect) {
        videoSelect.addEventListener('change', (e) => {
          setDevice('video', e.target.value);
        });
      }
    }

    async function setDevice(kind, deviceId) {
      const device = videoDevices.find(d => d.deviceId === deviceId);
      
      currentDevices = {
        ...currentDevices,
        [kind]: device
      };

      if (device && meeting?.self) {
        await meeting.self.setDevice(device);
      }
    }

    async function updateDeviceList() {
      if (!meeting?.self) return;

      try {
        videoDevices = await meeting.self.getVideoDevices();
        
        // Update current devices
        const currentMeetingDevices = meeting.self.getCurrentDevices();
        currentDevices = {
          video: currentMeetingDevices.video
        };

        render();
        setupEventListeners();
      } catch (e) {
        console.warn('Error updating video device list:', e);
      }
    }

    function init() {
      if (!meeting?.self) return;

      // Set up device list update listener
      deviceListUpdateCallback = updateDeviceList;
      meeting.self.addListener('deviceListUpdate', deviceListUpdateCallback);

      // Initial device list population
      updateDeviceList();
    }

    function cleanup() {
      if (meeting?.self && deviceListUpdateCallback) {
        meeting.self.removeListener('deviceListUpdate', deviceListUpdateCallback);
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
