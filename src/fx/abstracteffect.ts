import { AudioContext, GainNode } from '../webaudioapi.js';

export interface JSONEffect {
    params: any;
    definition?: any;
    name: string;
    id: string;
}

export interface AbstractEffectOptions {
    bypass?: boolean;
    activated?: boolean;
}

export class AbstractEffect {
    static Bypass = {
        default: false,
        type: 'boolean'
    }

    static Activated = {
        default: false,
        type: 'boolean'
    }

    static parameters = {'bypass' : AbstractEffect.Bypass, 'activated' : AbstractEffect.Activated};

    protected parameterValues = new Map<string, any>();

    public id = ('xxxxxxxx-xxxx-4xxx-Nxxx-xxxxxxxxxxxx'
        .replace(/x/g, () =>  ((Math.random()*16)|0).toString(16))
        .replace(/N/g, () => ((Math.random()*4)|0 + 8).toString(16)));

    set bypass(value) {
        this.parameterValues.set('bypass', value);
    }

    get bypass() {
        return this.parameterValues.get('bypass');
    }

    set activated(value: boolean) {
        this.parameterValues.set('activated', value);
        value ? this.activate() : this.deactivate();
    }

    get activated() {
        return this.parameterValues.get('activated');
    }

    get name() {
        return this.constructor.name;
    }

    protected audioContext: AudioContext;
    protected inputNode: GainNode;
    protected outputNode: GainNode;
    protected activateNode: GainNode;

    constructor(audioContext: AudioContext, options?: AbstractEffectOptions) {
        this.audioContext = audioContext;
        this.bypass = options?.bypass || AbstractEffect.Bypass.default;
        this.activateNode = new GainNode(audioContext);
        this.outputNode = new GainNode(audioContext);
        this.inputNode = new GainNode(audioContext);
    }

    toJSON(includeDefinition: boolean = false) {
        const returnObject: JSONEffect = {
            name: this.name,
            id: this.id,
            params: Object.fromEntries(this.parameterValues)
        };
        if (includeDefinition) {
            returnObject.definition = returnObject['definition'] = (this.constructor as any).parameters;
        }
        return returnObject;
    }

    static toJSON() {
        return {
            ...this.parameters,
            name: this.name,
        }
    }

    activate() {
        this.parameterValues.set('activated', true);
        this.input.connect(this.activateNode);
    }

    deactivate() {
        this.parameterValues.set('activated', false);
        this.input.disconnect(this.activateNode);
    }

    get input() {
        return this.inputNode;
    }

    get output() {
        return this.outputNode;
    }

    runPropertyCheck() {
        // Make sure all parameters are set and match definitions
        [...this.parameterValues.keys()].sort().join() === Object.keys((this.constructor as any).parameters).sort().join() || console.warn(`${this.name} Parameters do not match`);
        //console.log([...this.parameterValues.keys()].sort(), 'vs', (this.constructor as T).parameters.sort());
    }
}