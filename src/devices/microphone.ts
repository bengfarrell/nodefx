import { AudioContext, mediaDevices } from '../webaudioapi.js';
import { AbstractEffect } from '../fx/abstracteffect.js';
import { find } from '../library/index.js';

export type Microphone = {
    context: AudioContext,
    stream: MediaStreamAudioSourceNode
};

export interface MicrophoneFX extends Microphone {
    fx: AbstractEffect[]
}

export const Mic = (): Promise<Microphone> => {
    return new Promise((resolve, reject) => {
        if (!mediaDevices) {
            reject('Media devices not supported');
        }
        mediaDevices
            .getUserMedia({ audio: true })
            .then((stream: MediaStream) => {
                const audioCtx = new AudioContext();
                resolve({
                    stream: audioCtx.createMediaStreamSource(stream),
                    context: audioCtx
                });
            })
            .catch((err: Error) => {
                reject(err);
            });
    });
}


export const MicFX = (fx: {module?: typeof AbstractEffect, moduleName: string, options: any}[] | {module?: typeof AbstractEffect, moduleName: string, options: any}, activateImmediately = false) => {
    if (!Array.isArray(fx)) {
        fx = [fx];
    }

    fx.forEach((fxModule) => {
        if (fxModule.moduleName && !fxModule.module) {
            const ctor: typeof AbstractEffect = find(fxModule.moduleName) as unknown as typeof AbstractEffect;
            if (ctor) {
                fxModule.module = ctor;
            }
        }
    });
    return new Promise((resolve, reject) => {
        Mic().then((mic: Microphone) => {
            const fxNode =
                new (fx as {module: typeof AbstractEffect, options: any}[])[0].module(
                    mic.context,
                    (fx as {module: typeof AbstractEffect, options: any}[])[0].options);

            mic.stream.connect(fxNode.input);
            fxNode.output.connect(mic.context.destination);

            if (activateImmediately) {
                fxNode.activate();
            }
            resolve({
                ...mic,
                fx: [fxNode]
            });
        })
        .catch((err: Error) => {
                reject(err);
            });
    });
}