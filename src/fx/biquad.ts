import { BiquadFilterNode } from '../webaudioapi.js';
import { BaseEffect, BaseEffectOptions } from './baseeffect.js';

type BiquadType = 'lowpass' | 'highpass' | 'bandpass' | 'lowshelf' | 'highshelf' | 'peaking' | 'notch' | 'allpass';

export interface BiquadOptions extends BaseEffectOptions {
    frequency?: number;
    gain?: number;
    type?: BiquadType;
}

export class Biquad extends BaseEffect {
    static parameters = [
        ...super.parameters,
        'frequency',
        'gain',
        'type'
    ]

    static Frequency = {
        value: 1000,
        min: 20,
        max: 1000,
        type: 'float'
    }

    static Gain = {
        value: 10,
        min: 0,
        max: 100,
        type: 'float'
    }

    static Type: { value: BiquadType, options: BiquadType[], type: string } = {
        value: 'lowshelf',
        options: [
            'lowpass',
            'highpass',
            'bandpass',
            'lowshelf',
            'highshelf',
            'peaking',
            'notch',
            'allpass'
        ],
        type: 'string'
    }

    protected _frequency: number;
    set frequency(value) {
        this._frequency = value;
        this.biquadNode.frequency.value = value;
    }

    get frequency() {
        return this._frequency;
    }

    protected _gain: number;
    set gain(value) {
        this._gain = value;
        this.biquadNode.gain.value = value;
    }

    get gain() {
        return this._gain;
    }

    protected _type: BiquadType;
    set type(value: BiquadType) {
        this._type = value;
        this.biquadNode.type = value;
    }

    get type() {
        return this._type;
    }

    protected biquadNode: BiquadFilterNode;

    constructor(audioContext: AudioContext, options: BiquadOptions) {
        super(audioContext, options);
        this.biquadNode = new BiquadFilterNode(audioContext, { type: 'lowshelf', frequency: 1000, gain: 0 });
        this.activateNode.connect(this.biquadNode);
        this.biquadNode.connect(this.outputNode);

        this._frequency = options?.frequency || Biquad.Frequency.value;
        this.frequency = this._frequency;

        this._gain = options?.gain || Biquad.Gain.value;
        this.gain = this._gain;

        this._type = options?.type || Biquad.Type.value;
        this.type = this._type;

        /*this.frequency = options?.Frequency || Biquad.Frequency.value;
        this.type = options?.type || Biquad.Type.value;
        this.gain = options?.gain || Biquad.Gain.value;*/
    }
}