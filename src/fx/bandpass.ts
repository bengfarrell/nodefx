import { AbstractPassFilter, AbstractPassFilterOptions } from './abstractpassfilter.js';

export interface BandPassFilterOptions extends AbstractPassFilterOptions {}

export class BandPass extends AbstractPassFilter {
    protected override type: BiquadFilterType = 'bandpass';
}