import { list } from '../../library/index.js';
import { socket } from 'socket-comms';


socket.addEventListener('message', (event) => {
    const json = JSON.parse(event.data || event.detail);
    switch (json.messageType) {
        case 'fxChainUpdate':
            const snapshot = json.data.modules[0];
            document.querySelector('#fx-controls-container').innerHTML = `
                            <h4>${snapshot.name}</h4>
                            ${Object.keys(snapshot.definition).map(key => `
                                ${renderControl(snapshot.id, key, snapshot.params[key], snapshot.definition[key])}`).join('')}`;
            break;
    }
});

const fxChooser = 'fxChooser';

const renderControl = (id, prop, value, def) => {
    switch (def.type) {
        case 'boolean':
            return `<div class="prop-line"><label>${prop}</label><input id="${id}_${prop}" type="checkbox" ${value ? 'checked' : ''}/></div>`;

        case 'float':
            return `<div class="prop-line"><label>${prop}</label><input id="${id}_${prop}" type="range" step="any" min=${def.min} max=${def.max} value=${value}><span class="prop-label" id="label-${id}_${prop}">${value}</span></div>`;
    }
}

document.body.addEventListener('change', (e) => {
    if (e.target.id === fxChooser) {
        socket.send(JSON.stringify({ messageType: 'addFXNode', data: { moduleName: e.target.value } }));
    } else if (e.target.type === 'checkbox') {
        const id = e.target.id.split('_')[0];
        const param = e.target.id.split('_')[1];
        socket.send(JSON.stringify({ messageType: 'updateFXNode', data: { id, param, value: e.target.checked } }));
    }
});

document.body.addEventListener('input', (e) => {
    if (e.target.id === fxChooser) return;
    if (e.target.type === 'checkbox') return;

    const id = e.target.id.split('_')[0];
    const param = e.target.id.split('_')[1];
    socket.send(JSON.stringify({ messageType: 'updateFXNode', data: { id, param, value: e.target.value } }));
    document.querySelector(`#label-${id}_${param}`).innerHTML = e.target.value;
});

document.querySelector('#fx-menu-container').innerHTML = `
            <h3>FX Library</h3>
            <span>Change effect</span>
            <select id=${fxChooser}>
            <option>none</option>${list().map(fx => `<option>${fx}</option>`)}
            </select>`;