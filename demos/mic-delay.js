import { Microphone } from '../devices/microphone.js';
import { Delay } from '../fx/delay.js';

const mic = await Microphone;
const delay = new Delay(mic.context, { delayTime: .15 });
mic.stream.connect(delay.input);
delay.output.connect(mic.context.destination);
delay.activate();