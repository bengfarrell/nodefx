import { DelayNode, GainNode, BiquadFilterNode } from '../webaudioapi.js';
import { AbstractEffect, AbstractEffectOptions } from './abstracteffect.js';

export interface DelayOptions extends AbstractEffectOptions {
    delayTime?: number;
    feedback?: number;
    wetLevel?: number;
    dryLevel?: number;
    cutoff?: number;
}

export class Delay extends AbstractEffect {
    static DelayTime = {
        default: 1,
        min: .2,
        max: 10,
        type: 'float'
    }

    static Feedback = {
        default: 0.45,
        min: 0,
        max: 0.9,
        type: 'float'
    }

    static Cutoff=  {
        default: 20000,
        min: 20,
        max: 20000,
        type: 'float'
    }

    static WetLevel = {
        default: 0.5,
        min: 0,
        max: 1,
        type: 'float'
    }

    static DryLevel= {
        default: 1,
        min: 0,
        max: 1,
        type: 'float'
    }

    static parameters = {
        ...super.parameters,
        delayTime: Delay.DelayTime,
        feedback: Delay.Feedback,
        wetLevel: Delay.WetLevel,
        dryLevel: Delay.DryLevel,
        cutOff: Delay.Cutoff
    }

    set delayTime(value) {
        this.parameterValues.set('delayTime', value);
        this.delayNode.delayTime.value = value;
    }

    get delayTime() {
        return this.parameterValues.get('delayTime');
    }

    set feedback(value: number) {
        this.parameterValues.set('feedback', value);
        this.feedbackNode.gain.setTargetAtTime(value, this.audioContext.currentTime, 0.01);
    }

    get feedback() {
        return this.parameterValues.get('feedback');
    }

    set wetLevel(value) {
        this.parameterValues.set('wetLevel', value);
        this.wetNode.gain.setTargetAtTime(value, this.audioContext.currentTime, 0.01);
    }

    get wetLevel() {
        return this.parameterValues.get('wetLevel');
    }

    set dryLevel(value) {
        this.parameterValues.set('dryLevel', value);
        this.dryNode.gain.setTargetAtTime(value, this.audioContext.currentTime, 0.01);
    }

    get dryLevel() {
        return this.parameterValues.get('dryLevel');
    }

    set cutOff(value) {
        this.parameterValues.set('cutOff', value);
        this.filterNode.frequency.setTargetAtTime(value, this.audioContext.currentTime, 0.01);
    }

    get cutOff() {
        return this.parameterValues.get('cutOff');
    }

    protected dryNode: GainNode;
    protected wetNode: GainNode;
    protected filterNode: BiquadFilterNode;
    protected delayNode: DelayNode;
    protected feedbackNode: GainNode;

    constructor(audioContext: AudioContext, options: DelayOptions) {
        super(audioContext, options);
        this.dryNode = new GainNode(audioContext);
        this.wetNode = new GainNode(audioContext);
        this.filterNode = new BiquadFilterNode(audioContext);
        this.delayNode = new DelayNode(audioContext, { maxDelayTime: 10 });
        this.feedbackNode = new GainNode(audioContext);

        this.activateNode.connect(this.delayNode);
        this.activateNode.connect(this.dryNode);
        this.delayNode.connect(this.filterNode);
        this.filterNode.connect(this.feedbackNode);
        this.feedbackNode.connect(this.delayNode);
        this.feedbackNode.connect(this.wetNode);
        this.wetNode.connect(this.outputNode);
        this.dryNode.connect(this.outputNode);

        this.delayTime = options?.delayTime || Delay.DelayTime.default;
        this.feedback = options?.feedback || Delay.Feedback.default;
        this.wetLevel = options?.wetLevel || Delay.WetLevel.default;
        this.dryLevel = options?.dryLevel || Delay.DryLevel.default;
        this.cutOff = options?.cutoff || Delay.Cutoff.default;

        this.filterNode.type = 'lowpass';
    }
}