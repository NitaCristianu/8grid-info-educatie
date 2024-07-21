import { atom } from "jotai";
import { Graph, Label, ePoint, ePoints_Calc, eSegment, segment_render_mode, theme } from './props';
import { v4 } from "uuid";
import { expression } from "three/examples/jsm/nodes/Nodes.js";

export const ePoints_data = atom<ePoint[]>([]);

export const eSegments_data = atom<eSegment[]>([]);

export const ePoints_Calc_data = atom<ePoints_Calc[]>([]);

export const labels_data = atom<Label[]>([]);

// export const GRAPHS = atom<Graph[]>([]);

export const GRAPHS = atom<Graph[]>([]);

export const themes: theme[] = [
    {
        accent: "rgb(246, 252, 251)_",
        secondary: "rgb(10, 13, 20)",
        background: "rgb(94, 128, 215)",
        name: "baby blue"
    },
    {
        accent: "rgb(12, 18, 35)_",
        secondary: "rgb(93, 97, 128)",
        background: "rgb(230, 233, 255)",
        name: "snow"
    },
    {
        accent: "rgb(246, 252, 251)_",
        secondary: "rgb(5, 31, 20)",
        background: "rgb(41, 180, 133)",
        name: "dragon red"
    },
]