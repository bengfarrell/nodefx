import { DelayNode, GainNode, BiquadFilterNode } from '../webaudioapi.js';
import { BaseEffect, BaseEffectOptions } from './baseeffect.js';

export interface DelayOptions extends BaseEffectOptions {
    delayTime?: number;
    feedback?: number;
    wetLevel?: number;
    dryLevel?: number;
    cutoff?: number;
}

export class Delay extends BaseEffect {
    static parameters = [
        ...super.parameters,
        'delayTime',
        'feedback',
        'wetLevel',
        'dryLevel',
        'cutOff'
    ]

    static DelayTime = {
        value: 1,
        min: .2,
        max: 10,
        type: 'float'
    }

    static Feedback = {
        value: 0.45,
        min: 0,
        max: 0.9,
        type: 'float'
    }

    static Cutoff=  {
        value: 20000,
        min: 20,
        max: 20000,
        type: 'float'
    }

    static WetLevel = {
        value: 0.5,
        min: 0,
        max: 1,
        type: 'float'
    }

    static DryLevel= {
        value: 1,
        min: 0,
        max: 1,
        type: 'float'
    }

    protected _delayTime: number;
    set delayTime(value) {
        this._delayTime = value;
        this.delayNode.delayTime.value = value;
    }

    get delayTime() {
        return this._delayTime;
    }

    protected _feedback: number;
    set feedback(value: number) {
        this._feedback = value;
        this.feedbackNode.gain.setTargetAtTime(value, this.audioContext.currentTime, 0.01);
    }

    get feedback() {
        return this._feedback;
    }

    protected _wetLevel: number;
    set wetLevel(value) {
        this._wetLevel = value;
        this.wetNode.gain.setTargetAtTime(this._wetLevel, this.audioContext.currentTime, 0.01);
    }

    get wetLevel() {
        return this._wetLevel;
    }

    protected _dryLevel: number;
    set dryLevel(value) {
        this._dryLevel = value;
        this.dryNode.gain.setTargetAtTime(this._dryLevel, this.audioContext.currentTime, 0.01);
    }

    get dryLevel() {
        return this._dryLevel;
    }

    protected _cutOff: number;
    set cutOff(value) {
        this._cutOff = value;
        this.filterNode.frequency.setTargetAtTime(this._cutOff, this.audioContext.currentTime, 0.01);
    }

    get cutOff() {
        return this._cutOff;
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

        this._delayTime = options?.delayTime || Delay.DelayTime.value;
        this.delayTime = this._delayTime;

        this._feedback = options?.feedback || Delay.Feedback.value;
        this.feedback = this._feedback;

        this._wetLevel = options?.wetLevel || Delay.WetLevel.value;
        this.wetLevel = this._wetLevel;

        this._dryLevel = options?.dryLevel || Delay.DryLevel.value;
        this.dryLevel = this._dryLevel;

        this._cutOff = options?.cutoff || Delay.Cutoff.value;
        this.cutOff = this._cutOff;

        this.filterNode.type = 'lowpass';
    }
}