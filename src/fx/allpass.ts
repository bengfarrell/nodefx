import { AbstractPassFilter, AbstractPassFilterOptions } from './abstractpassfilter.js';

export interface AllPassFilterOptions extends AbstractPassFilterOptions {}

export class AllPass extends AbstractPassFilter {
    protected override type: BiquadFilterType = 'allpass';
}