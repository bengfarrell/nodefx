import * as FXLibrary from '../fx/index.js';
import { AbstractEffect } from '../fx/abstracteffect.js';

export const find = (name: string) => {
    for (let fxLibraryKey in FXLibrary) {
        if (fxLibraryKey.toLowerCase() === name.toLowerCase()) {
            return (FXLibrary as unknown as { [key: string]: AbstractEffect})[fxLibraryKey];
        }
    }
    return undefined;
}

export const list = () => {
    return Object.keys(FXLibrary).map(name => name.toLowerCase());
}