import { MicFX } from '../devices/index.js';
import { fx } from '../index.js';

export const mic = await MicFX({ module: fx.HighPass });