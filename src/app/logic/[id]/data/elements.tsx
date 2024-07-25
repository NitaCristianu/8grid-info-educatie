// HERE IS THE DATA OF EVERY AND, NOT, PIN, CUSTOM CHIP

import And from "../class/And";
import Cip from "../class/Cip";
import Connection from "../class/Connection";
import Not from "../class/Not";
import Pin from "../class/Pin";

export interface Prefab {
    inputsNum : number,
    outputFormulas : string[],
    name : string,
    desc? : string,
    color : string
}

export const Inputs: Pin[] = [
    new Pin({
        type: 'input',
        y: 100,
    }),
    new Pin({
        type: 'input',
        y: 200,
    }),
];

export const Outputs: Pin[] = [
    new Pin({
        type: 'output',
        y: 100,
    }),
];

export const Cips: Cip[] = []
export const Prefabs: Prefab[] = [];

export const Connections: Connection[] = [];