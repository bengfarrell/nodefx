import { AbstractPassFilter, AbstractPassFilterOptions } from './abstractpassfilter.js';

export interface HighPassFilterOptions extends AbstractPassFilterOptions {}

export class HighPass extends AbstractPassFilter {
    protected override type: BiquadFilterType = 'highpass';
}