import { MicFX } from '../../devices/index.js';

let mic;
const dispatcherEl = document.createElement('div');

const _socket = {
    send: (data) => {
        const json = JSON.parse(data);
        switch (json.messageType) {
            case 'addFXNode':
                createMicrophone(json.data.moduleName);
                break;

            case 'updateFXNode':
                const fxNode = mic.fx.find(fx => fx.id === json.data.id);
                fxNode[json.data.param] = json.data.value;
                break;

            default:
                break;
        }
    }
}

export const socket = {
    addEventListener: (type, handler, options) => {
        dispatcherEl.addEventListener(type, handler, options);
    },
    send: (data) => {
        _socket.send(data);
    }
}

export const createMicrophone = (fxName) => {
    MicFX({moduleName: fxName}, false).then(microphone => {
        mic = microphone;
        dispatcherEl.dispatchEvent(new CustomEvent('message', { detail: JSON.stringify({ messageType: 'fxChainUpdate', data: { modules: mic.fx }})}));
        //socket.send(JSON.stringify({ messageType: 'fxChainUpdate', data: { modules: mic.fx }}));
    });
};