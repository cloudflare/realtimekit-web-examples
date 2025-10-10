// Media Preview Modal Component
window.MediaPreviewModal = (function() {
  
  function create(container, meeting, open = false) {
    const { customStatesStore } = window.StatesStore;
    let activeTab = 'video';
    let audioPreviewCleanup = null;
    let videoPreviewCleanup = null;

    function render() {
      if (!open) {
        container.innerHTML = '';
        return;
      }

      const canProduceAudio = meeting?.self?.permissions?.canProduceAudio === 'ALLOWED';
      const canProduceVideo = meeting?.self?.permissions?.canProduceVideo === 'ALLOWED';

      container.innerHTML = `
        <rtk-dialog class="media-preview-modal" open="${open}">
          <div class="flex min-w-[720px] min-h-[480px] bg-[#222222]">
            <aside class="flex flex-col w-1/3 bg-[#181818]">
              <header class="flex justify-center items-center h-[100px]">
                <h2>Media Preview</h2>
              </header>
              ${canProduceAudio ? `
                <button
                  id="audio-tab-btn"
                  type="button"
                  class="flex justify-between p-2 rounded ${activeTab === 'audio' ? 'bg-[#2160FD]' : ''}">
                  Audio
                  <div>
                    <rtk-icon id="audio-tab-icon"></rtk-icon>
                  </div>
                </button>
              ` : ''}
              ${canProduceVideo ? `
                <button
                  id="video-tab-btn"
                  type="button"
                  class="flex justify-between p-2 rounded ${activeTab === 'video' ? 'bg-[#2160FD]' : ''}">
                  Video
                  <div>
                    <rtk-icon id="video-tab-icon"></rtk-icon>
                  </div>
                </button>
              ` : ''}
            </aside>
            <main class="flex flex-col w-2/3">
              <div id="preview-content"></div>
            </main>
          </div>
        </rtk-dialog>
      `;
    }

    function setupEventListeners() {
      if (!open) return;

      const dialog = container.querySelector('rtk-dialog');
      if (dialog) {
        dialog.addEventListener('rtkDialogClose', () => {
          customStatesStore.setCustomStates({ activeMediaPreviewModal: false });
        });
      }

      // Set up icons
      const audioIcon = container.querySelector('#audio-tab-icon');
      const videoIcon = container.querySelector('#video-tab-icon');
      
      try {
        if (window.RealtimeKitUI && window.RealtimeKitUI.defaultIconPack) {
          if (audioIcon) {
            audioIcon.icon = window.RealtimeKitUI.defaultIconPack.mic_on;
          }
          if (videoIcon) {
            videoIcon.icon = window.RealtimeKitUI.defaultIconPack.video_on;
          }
        }
      } catch (e) {
        console.warn('Could not set icons:', e);
      }

      // Set up tab buttons
      const audioTabBtn = container.querySelector('#audio-tab-btn');
      const videoTabBtn = container.querySelector('#video-tab-btn');

      if (audioTabBtn) {
        audioTabBtn.addEventListener('click', () => {
          setActiveTab('audio');
        });
      }

      if (videoTabBtn) {
        videoTabBtn.addEventListener('click', () => {
          setActiveTab('video');
        });
      }
    }

    function setActiveTab(tab) {
      activeTab = tab;
      
      // Update button styles
      const audioTabBtn = container.querySelector('#audio-tab-btn');
      const videoTabBtn = container.querySelector('#video-tab-btn');
      
      if (audioTabBtn) {
        audioTabBtn.className = `flex justify-between p-2 rounded ${activeTab === 'audio' ? 'bg-[#2160FD]' : ''}`;
      }
      if (videoTabBtn) {
        videoTabBtn.className = `flex justify-between p-2 rounded ${activeTab === 'video' ? 'bg-[#2160FD]' : ''}`;
      }

      updatePreviewContent();
    }

    function updatePreviewContent() {
      const previewContent = container.querySelector('#preview-content');
      if (!previewContent) return;

      // Clean up existing previews
      if (audioPreviewCleanup) {
        audioPreviewCleanup();
        audioPreviewCleanup = null;
      }
      if (videoPreviewCleanup) {
        videoPreviewCleanup();
        videoPreviewCleanup = null;
      }

      // Create new preview based on active tab
      if (activeTab === 'audio' && window.AudioPreview) {
        audioPreviewCleanup = window.AudioPreview.create(previewContent, meeting);
      } else if (activeTab === 'video' && window.VideoPreview) {
        videoPreviewCleanup = window.VideoPreview.create(previewContent, meeting);
      }
    }

    function init() {
      render();
      setupEventListeners();
      updatePreviewContent();
    }

    function cleanup() {
      if (audioPreviewCleanup) {
        audioPreviewCleanup();
      }
      if (videoPreviewCleanup) {
        videoPreviewCleanup();
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
