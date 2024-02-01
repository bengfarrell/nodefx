import { BiquadFilterNode } from '../webaudioapi.js';
import { AbstractEffect, AbstractEffectOptions } from './abstracteffect.js';

export interface AbstractPassFilterOptions extends AbstractEffectOptions {
    frequency?: number;
    qFactor?: number;
}

export class AbstractPassFilter extends AbstractEffect {
    static Frequency = {
        default: 350,
        min: 20,
        max: 1000,
        type: 'float'
    }

    static QFactor = {
        default: 1,
        min: 0,
        max: 10,
        type: 'float'
    }

    static parameters = {
        ...super.parameters,
        frequency: AbstractPassFilter.Frequency,
        qFactor: AbstractPassFilter.QFactor
    }

    set frequency(value) {
        this.parameterValues.set('frequency', value);
        this.biquadNode.frequency.value = value;
    }

    get frequency() {
        return this.parameterValues.get('frequency');
    }

    set qFactor(value) {
        this.parameterValues.set('qFactor', value);
        this.biquadNode.Q.value = value;
    }

    get qFactor() {
        return this.parameterValues.get('qFactor');
    }

    protected biquadNode: BiquadFilterNode;
    protected type?: BiquadFilterType;

    constructor(audioContext: AudioContext, options?: AbstractPassFilterOptions) {
        super(audioContext, options);
        this.biquadNode = new BiquadFilterNode(audioContext, { type: this.type });
        this.activateNode.connect(this.biquadNode);
        this.biquadNode.connect(this.outputNode);

        this.frequency = options?.frequency || AbstractPassFilter.Frequency.default;
        this.qFactor = options?.qFactor || AbstractPassFilter.QFactor.default;
    }
}