import { AudioContext, mediaDevices } from '../webaudioapi.js';

export const Microphone:Promise<{ context: AudioContext, stream: MediaStreamAudioSourceNode}> = new Promise((resolve, reject) => {
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