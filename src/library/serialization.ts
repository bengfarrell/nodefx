import { AbstractEffect, JSONEffect } from '../fx/abstracteffect.js';
import { find } from './management.js';

export const FXChainToJSON = (fx: AbstractEffect[] | AbstractEffect, includeDefinitions: boolean = false ) => {
    if (!Array.isArray(fx)) {
        fx = [fx];
    }
    return fx.map((effect: AbstractEffect) => effect.toJSON(includeDefinitions));
}

export const FXChainFromJSON = (fxJSON: JSONEffect[] | JSONEffect, audioContext: AudioContext) => {
    const chain: AbstractEffect[] = [];
    if (!Array.isArray(fxJSON)) {
        fxJSON = [fxJSON];
    }
    fxJSON.forEach((effect: JSONEffect) => {
        const fxClass: AbstractEffect | undefined = find(effect.name);
        if (fxClass) {
            chain.push(new (fxClass as any)(audioContext));
        }
    });
    return chain;
}