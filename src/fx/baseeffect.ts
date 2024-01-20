import { AudioContext, GainNode } from '../webaudioapi.js';

export interface BaseEffectOptions {
    bypass?: boolean;
}

export class BaseEffect {
    static parameters = ['bypass'];

    static Bypass = {
        value: false,
        type: 'boolean'
    }

    protected _bypass: boolean;
    set bypass(value) {
        this._bypass = value;
    }

    get bypass() {
        return this._bypass;
    }

    get name() {
        return this.constructor.name;
    }

    protected audioContext: AudioContext;
    protected inputNode: GainNode;
    protected outputNode: GainNode;
    protected activateNode: GainNode;

    constructor(audioContext: AudioContext, options: BaseEffectOptions) {
        this.audioContext = audioContext;
        this._bypass = options?.bypass || BaseEffect.Bypass.value;
        this.bypass = this._bypass;
        this.activateNode = new GainNode(audioContext);
        this.outputNode = new GainNode(audioContext);
        this.inputNode = new GainNode(audioContext);
    }

    activate() {
        this.input.connect(this.activateNode);
    }
    deactivate() {
        this.input.disconnect(this.activateNode);
    }

    get input() {
        return this.inputNode;
    }

    get output() {
        return this.outputNode;
    }
}