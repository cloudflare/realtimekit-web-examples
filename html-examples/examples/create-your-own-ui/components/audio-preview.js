// Audio Preview Component
window.AudioPreview = (function() {
  
  function create(container, meeting) {
    let audioDevices = [];
    let speakerDevices = [];
    let currentDevices = {};
    let deviceListUpdateCallback = null;
    let testAudioEl = null;

    function render() {
      const canProduceAudio = meeting?.self?.permissions?.canProduceAudio === 'ALLOWED';
      let unnamedMicCount = 0;
      let unnamedSpeakerCount = 0;

      container.innerHTML = `
        <div class="flex flex-col p-4">
          <audio
            id="test-audio"
            preload="auto"
            src="https://assets.dyte.io/ui-kit/speaker-test.mp3">
          </audio>
          ${canProduceAudio ? `
            <div class="mb-4">
              <label class="block mb-2">Microphone</label>
              <div>
                <select
                  id="audio-device-select"
                  class="mt-2 w-full text-ellipsis bg-[#1F1F1F] p-2 text-white">
                  ${audioDevices.map(({ deviceId, label }) => `
                    <option
                      value="${deviceId}"
                      ${currentDevices.audio?.deviceId === deviceId ? 'selected' : ''}>
                      ${label || `Microphone ${++unnamedMicCount}`}
                    </option>
                  `).join('')}
                </select>
                <rtk-audio-visualizer id="audio-visualizer" class="mt-2"></rtk-audio-visualizer>
              </div>
            </div>
          ` : ''}
          <div>
            ${speakerDevices.length > 0 ? `
              <div class="mb-4">
                <label class="block mb-2">Speaker Output</label>
                <div>
                  <select
                    id="speaker-device-select"
                    class="mt-2 w-full text-ellipsis bg-[#1F1F1F] p-2 text-white">
                    ${speakerDevices.map(({ deviceId, label }) => `
                      <option
                        value="${deviceId}"
                        ${currentDevices.speaker?.deviceId === deviceId ? 'selected' : ''}>
                        ${label || `Speaker ${++unnamedSpeakerCount}`}
                      </option>
                    `).join('')}
                  </select>
                </div>
              </div>
            ` : ''}
            <rtk-button id="test-speaker-btn" class="mt-2 bg-[#1F1F1F]" size="lg">
              <rtk-icon id="speaker-icon" slot="start"></rtk-icon>
              Test
            </rtk-button>
          </div>
        </div>
      `;
    }

    function setupEventListeners() {
      testAudioEl = container.querySelector('#test-audio');

      // Set up audio visualizer
      const audioVisualizer = container.querySelector('#audio-visualizer');
      if (audioVisualizer && meeting?.self) {
        audioVisualizer.participant = meeting.self;
      }

      // Set up speaker icon
      const speakerIcon = container.querySelector('#speaker-icon');
      if (speakerIcon) {
        try {
          if (window.RealtimeKitUI && window.RealtimeKitUI.defaultIconPack) {
            speakerIcon.icon = window.RealtimeKitUI.defaultIconPack.speaker;
          }
        } catch (e) {
          console.warn('Could not set speaker icon:', e);
        }
      }

      // Set up device selectors
      const audioSelect = container.querySelector('#audio-device-select');
      const speakerSelect = container.querySelector('#speaker-device-select');

      if (audioSelect) {
        audioSelect.addEventListener('change', (e) => {
          setDevice('audio', e.target.value);
        });
      }

      if (speakerSelect) {
        speakerSelect.addEventListener('change', (e) => {
          setDevice('speaker', e.target.value);
        });
      }

      // Set up test button
      const testBtn = container.querySelector('#test-speaker-btn');
      if (testBtn) {
        testBtn.addEventListener('click', () => {
          testAudio();
        });
      }
    }

    function setDevice(kind, deviceId) {
      const devices = kind === 'audio' ? audioDevices : speakerDevices;
      const device = devices.find(d => d.deviceId === deviceId);
      
      currentDevices = {
        ...currentDevices,
        [kind]: device
      };

      if (device && meeting?.self) {
        meeting.self.setDevice(device);
        if (device.kind === 'audiooutput' && testAudioEl?.setSinkId) {
          testAudioEl.setSinkId(device.deviceId);
        }
      }
    }

    function testAudio() {
      if (testAudioEl) {
        testAudioEl.play();
      }
    }

    async function updateDeviceList() {
      if (!meeting?.self) return;

      try {
        audioDevices = await meeting.self.getAudioDevices();
        speakerDevices = await meeting.self.getSpeakerDevices();
        
        // Update current devices
        const currentMeetingDevices = meeting.self.getCurrentDevices();
        currentDevices = {
          audio: currentMeetingDevices.audio,
          speaker: currentMeetingDevices.speaker
        };

        render();
        setupEventListeners();
      } catch (e) {
        console.warn('Error updating device list:', e);
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
