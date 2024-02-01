import { MicFX } from '../../devices/index.js';

let mic;


export const socket = new WebSocket('ws://localhost:8080');

// Connection opened
socket.addEventListener('open', (event) => {});

// Listen for messages
socket.addEventListener('message', (event) => {
    switch (event.data.messageType) {
        case 'addFXNode':
            createMicrophone(data.data.moduleName);
            break;

        case 'updateFXNode':
            const fxNode = mic.fx.find(fx => fx.id === data.data.id);
            fxNode[data.data.param] = data.data.value;
            break;

        default:
            break;
    }
});

export const createMicrophone = (fxName) => {
    MicFX({module: fxName}, false).then(microphone => {
        mic = microphone;
        socket.send({ messageType: 'fxChainUpdate', data: { modules: mic.fx }});
    });
};