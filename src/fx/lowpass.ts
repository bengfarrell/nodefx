import { AbstractPassFilter, AbstractPassFilterOptions } from './abstractpassfilter.js';

export interface LowPassFilterOptions extends AbstractPassFilterOptions {}

export class LowPass extends AbstractPassFilter {
    protected override type: BiquadFilterType = 'highpass';
}