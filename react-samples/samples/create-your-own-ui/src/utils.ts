import { UIConfig } from '@cloudflare/realtimekit-ui';

export function setFullScreenToggleTargetElement({config, targetElementId}: { config: UIConfig, targetElementId: string }){
    if (config.root && Array.isArray(config.root['div#controlbar-left'])) {
        const fullScreenToggleIndex = config.root['div#controlbar-left'].indexOf('rtk-fullscreen-toggle');
        if(fullScreenToggleIndex > -1){
            config.root['div#controlbar-left'][fullScreenToggleIndex] = ['rtk-fullscreen-toggle', {
                variant: 'vertical',
                targetElement: document.querySelector(`#${targetElementId}`),
            }];
        }
    }
    ['rtk-more-toggle.activeMoreMenu', 'rtk-more-toggle.activeMoreMenu.md', 'rtk-more-toggle.activeMoreMenu.sm'].forEach((configElemKey) => {
        const configElem = config?.root?.[configElemKey] as any;
        configElem?.forEach((rtkElemConfigSet: any) => {
            if (rtkElemConfigSet[0] === 'rtk-fullscreen-toggle') {
                rtkElemConfigSet[1].targetElement = document.querySelector(`#${targetElementId}`);
            }
        });
    });
}