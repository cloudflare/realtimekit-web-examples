import { defaultIconPack } from '@cloudflare/realtimekit-react-ui';
import type { RTKPlugin } from '@cloudflare/realtimekit';
const HOST_PRESET = 'Video Call Host Demo';
export const WHITEBOARD_ID = "ae79b269-24ca-4f8a-8112-f96084c8c19a";
export const iconPack = {
    ...defaultIconPack,
    'light': '<svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.996 19.01a.75.75 0 0 1 .743.649l.007.102v1.5a.75.75 0 0 1-1.493.101l-.007-.101v-1.5a.75.75 0 0 1 .75-.75Zm6.022-2.072 1.06 1.06a.75.75 0 1 1-1.06 1.061l-1.06-1.06a.75.75 0 0 1 1.06-1.061Zm-10.983 0a.75.75 0 0 1 0 1.06L5.974 19.06a.75.75 0 0 1-1.06-1.06l1.06-1.061a.75.75 0 0 1 1.06 0ZM12 6.475a5.525 5.525 0 1 1 0 11.05 5.525 5.525 0 0 1 0-11.05Zm0 1.5a4.025 4.025 0 1 0 0 8.05 4.025 4.025 0 0 0 0-8.05Zm9.25 3.293a.75.75 0 0 1 .102 1.493l-.102.007h-1.5a.75.75 0 0 1-.102-1.493l.102-.007h1.5Zm-17-.029a.75.75 0 0 1 .102 1.494l-.102.006h-1.5a.75.75 0 0 1-.102-1.493l.102-.007h1.5Zm1.64-6.37.084.072 1.06 1.06a.75.75 0 0 1-.976 1.134l-.084-.073-1.06-1.06a.75.75 0 0 1 .976-1.134Zm13.188.072a.75.75 0 0 1 .073.977l-.073.084-1.06 1.06a.75.75 0 0 1-1.133-.976l.072-.084 1.06-1.061a.75.75 0 0 1 1.061 0ZM12 1.99a.75.75 0 0 1 .743.648l.007.102v1.5a.75.75 0 0 1-1.493.101l-.007-.102v-1.5a.75.75 0 0 1 .75-.75Z" fill="currentColor"/></svg>',
    'dark': '<svg fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M20.026 17.001c-2.762 4.784-8.879 6.423-13.663 3.661a9.964 9.964 0 0 1-3.234-2.983.75.75 0 0 1 .365-1.131c3.767-1.348 5.785-2.911 6.956-5.146 1.232-2.353 1.551-4.93.689-8.464a.75.75 0 0 1 .769-.926 9.961 9.961 0 0 1 4.457 1.327C21.149 6.1 22.788 12.217 20.025 17Zm-8.248-4.903c-1.25 2.388-3.31 4.099-6.817 5.499a8.492 8.492 0 0 0 2.152 1.766 8.501 8.501 0 1 0 8.502-14.725 8.485 8.485 0 0 0-2.792-1.016c.647 3.384.23 6.044-1.045 8.476Z" fill="currentColor"/></svg>',
    join_stage: '<svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4 12.02c0 1.06.2 2.1.6 3.08l.6 1.42c.22.55.64 1.01 1.17 1.29.27.14.56.21.86.21h2.55c.77 0 1.49-.41 1.87-1.08.5-.87 1.02-1.7 1.72-2.43l1.32-1.39c.44-.46.97-.84 1.49-1.23l.59-.45a.6.6 0 0 0 .23-.47c0-.75-.54-1.57-1.22-1.79a3.34 3.34 0 0 0-2.78.29V4.5a1.5 1.5 0 0 0-2.05-1.4 1.5 1.5 0 0 0-2.9 0A1.5 1.5 0 0 0 6 4.5v.09A1.5 1.5 0 0 0 4 6v6.02ZM8 4.5v4a.5.5 0 0 0 1 0v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 0 1 0v-4a.5.5 0 0 1 1 0v6a.5.5 0 0 0 .85.37h.01c.22-.22.44-.44.72-.58.7-.35 2.22-.57 2.4.5l-.53.4c-.52.4-1.04.78-1.48 1.24l-1.33 1.38c-.75.79-1.31 1.7-1.85 2.63-.21.36-.6.58-1.01.58H7.23a.87.87 0 0 1-.4-.1 1.55 1.55 0 0 1-.71-.78l-.59-1.42a7.09 7.09 0 0 1-.53-2.7V6a.5.5 0 0 1 1 0v3.5a.5.5 0 0 0 1 0v-5a.5.5 0 0 1 1 0Z" fill="currentColor"></path></svg>',
}
export const saveWhiteboard = async (whiteboardPlugin: RTKPlugin | undefined) => {
    if (!whiteboardPlugin) return;
    await new Promise((resolve) => {
        whiteboardPlugin.removeAllListeners('board-saved' as any);
        whiteboardPlugin.on('board-saved' as any, (data: any) => {
            console.log('board saved:', data);
            resolve(true);
        })
        whiteboardPlugin.sendData({
            eventName: 'save-board',
            data: { eventName: 'save-board' }
        })
    });
  }
export default HOST_PRESET;
