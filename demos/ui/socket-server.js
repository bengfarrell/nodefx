import { WebSocketServer } from 'ws';
import { MicFX } from '../../devices/index.js';
import { FXChainToJSON } from '../../library/index.js';

let mic;
const wss = new WebSocketServer({ port: 8080 });
wss.on('connection', (socket) => {
    socket.on('error', console.error);

    socket.on('message', (data) => {
        data = JSON.parse(data);
        switch (data.messageType) {
            case 'addFXNode':
                MicFX({ moduleName: data.data.moduleName }, false).then(microphone => {
                    mic = microphone;
                    console.log('add mic with', data.data.moduleName);
                    socket.send(JSON.stringify({ messageType: 'fxChainUpdate', data: { modules: FXChainToJSON(mic.fx, true) }}));
                });
                break;

            case 'updateFXNode':
                const fxNode = mic.fx.find(fx => fx.id === data.data.id);
                fxNode[data.data.param] = data.data.value;
                console.log('update', fxNode.name, data.data.param, data.data.value);
                break;

            default:
                break;
        }
    });
});