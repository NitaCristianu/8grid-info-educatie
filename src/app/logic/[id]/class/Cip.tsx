import { v4 } from "uuid";
import { MouseObject } from "../hooks/useMouse";
import { inCircle, inRect } from "../utils/math";
import { voltage } from "../interfaces/keywords";
import Connection, { gateLocation } from "./Connection";
import { ConstructionVar1, Position, SelectedElements } from "../data/vars";
import { Connections, Prefabs } from "../data/elements";
import { SELECT_COLOR } from "../data/consts";

export const PIN_SPACING_Y = 32;
export const ROUNDNESS = 8;
export const OFFSETY = 16;
export const SUBPIN_RADIUS = 10;
export const FONT_SIZE = 32;
export const HOLD_SHADOW_OFFSET = 5;
export const HIGH_COLOR = 'rgba(80,255,80,0.7)';
export const LOW_COLOR = 'rgba(30,30,30,0.2)';

export interface CipProperties {
    color?: string,
    tag?: string,
    id?: string,
    x?: number,
    y?: number,
    inputsNum?: number,
    outputsNum?: number,
    width?: number
}

export default class Cip {

    public declare color;
    public declare tag;
    public declare id;
    public declare x;
    public declare y;
    public declare inputsNum;
    public declare outputsNum;
    public declare width;

    public declare holding;
    public declare selected;
    public declare height;
    public declare tlx;
    public declare tly;

    public declare inputs: voltage[];
    public declare outputs: voltage[];

    public declare outputFormulas: string[];

    constructor(props?: CipProperties) {
        this.color = props?.color || "#ffffff";
        this.tag = props?.tag || "Cip";
        this.id = props?.id || v4();
        this.x = props?.x || 0;
        this.y = props?.y || 0;
        this.inputsNum = props?.inputsNum || 1;
        this.outputsNum = props?.outputsNum || 1;
        this.width = props?.width || 100;
        this.holding = false;
        this.selected = false;

        this.height = Math.max(this.outputsNum, this.inputsNum) * PIN_SPACING_Y + OFFSETY;
        this.tlx = this.x - this.width / 2;
        this.tly = this.y - this.height / 2;

        this.outputFormulas = []
        this.inputs = [];
        this.outputs = [];

        for (let i = 0; i < this.inputsNum; i++) this.inputs.push('unset');
        for (let i = 0; i < this.outputsNum; i++) this.outputs.push('unset');
        for (let i = 0; i < this.outputsNum; i++) this.outputFormulas.push('');
    }

    getPinPosition(index: number, type: "input" | "output") {
        index -= (type == 'input' ? this.inputsNum / 2 : this.outputsNum / 2);
        const x = type == 'input' ? this.tlx : this.tlx + this.width;
        const y = this.tly + this.height / 2 + index * PIN_SPACING_Y + OFFSETY;
        return { x, y };
    }

    update(mouse: MouseObject, prevMouse: MouseObject) {
        const inrect = inRect(mouse.position.x, mouse.position.y, this.tlx, this.tly, this.width, this.height);
        if (inrect && mouse.buttons.left && !prevMouse.buttons.left) {
            this.holding = true;
        }
        if (!inrect && mouse.buttons.right && !prevMouse.buttons.right) {
            SelectedElements.set((SelectedElements.value || []).filter(item => item != this.id));
            this.selected = false;
        }
        if (inrect && mouse.buttons.doubleClick) {
            this.selected = true;
            SelectedElements.set([...SelectedElements.value || [], this.id]);
        }
        if (mouse.buttons.left == false) this.holding = false;
        if (this.holding) {
            this.x += (mouse.position.x - prevMouse.position.x);
            this.y += (mouse.position.y - prevMouse.position.y);
        }

        // Detect click on a cip pin.
        const subpin_boundingbox = inRect(mouse.position.x, mouse.position.y, this.tlx - SUBPIN_RADIUS, this.tly, this.width + 2 * SUBPIN_RADIUS, this.height);
        if (subpin_boundingbox && mouse.buttons.right && !prevMouse.buttons.right) {
            var pinLocation: { index: number, type: 'input' | 'output' } | null = null;
            for (let i = 0; i < this.inputsNum; i++) {
                const pos = this.getPinPosition(i, 'input');
                if (inCircle(mouse.position.x, mouse.position.y, pos.x, pos.y, SUBPIN_RADIUS)) pinLocation = { index: i, type: 'input' };
            }
            for (let i = 0; i < this.outputsNum; i++) {
                const pos = this.getPinPosition(i, 'output');
                if (inCircle(mouse.position.x, mouse.position.y, pos.x, pos.y, SUBPIN_RADIUS)) pinLocation = { index: i, type: 'output' };
            }
            if (pinLocation) {
                ConstructionVar1.set({
                    type: 'gatetype',
                    index: pinLocation.index,
                    subtype: pinLocation.type,
                    id: this.id,

                })
            }
        }

        // Recaulate the position
        const position = Position.value || { x: 0, y: 0 };
        this.tlx = this.x - this.width / 2 + position.x;
        this.tly = this.y - this.height / 2 + position.y;
    }

    public getConnectionAt(index: number): Connection | null {
        for (let i = 0; i < Connections.length; i++) {
            const connection = Connections[i];
            const end = connection.end;
            if (end.type == 'output') continue;
            if (end.location.id != this.id) continue;
            if (end.location.index != index) continue;
            return connection;
        };
        return null;
    }

    get allInputs(): boolean {
        const indexes = this.inputs.map(inp => false);
        Connections.forEach(connection => {
            const end = connection.end;
            if (end.type == 'output') return;
            if (end.location.id != this.id) return;
            if (end.location.index == undefined) return;

            indexes[end.location.index] = true;
        })
        var n = true;
        indexes.forEach(bool => n = n && bool);
        return n;
    }

    setInput(index: number, value: voltage) {
        this.inputs[index] = value;
    }

    draw(ctx: CanvasRenderingContext2D, mouse: MouseObject) {

        const position = Position.value || { x: 0, y: 0 };
        if (this.holding || this.selected) {
            ctx.beginPath();
            ctx.shadowBlur = 20;
            ctx.fillStyle = SELECT_COLOR;
            ctx.roundRect(this.tlx - HOLD_SHADOW_OFFSET / 2, this.tly - HOLD_SHADOW_OFFSET / 2, this.width + HOLD_SHADOW_OFFSET, this.height + HOLD_SHADOW_OFFSET, ROUNDNESS * 1.35);
            ctx.shadowColor = this.color[0];
            ctx.fill();
            ctx.shadowBlur = 0;

        }

        if (!this.holding && !this.selected) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(0,0,0, 0.8)'
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.roundRect(this.tlx, this.tly, this.width, this.height, ROUNDNESS);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.roundRect(this.tlx, this.tly, this.width, this.height, ROUNDNESS);
        ctx.fill();

        ctx.beginPath();
        ctx.font = `bold ${FONT_SIZE}px Poppins`;
        ctx.fillStyle = "rgba(0,0,0,0.2)";
        const measurments = ctx.measureText(this.tag.toUpperCase());
        const centerx = this.x - measurments.width / 2 + position.x;
        const centery = this.y + FONT_SIZE / 4 + position.y;
        ctx.fillText(this.tag.toUpperCase(), centerx, centery);


        for (let i = -this.inputsNum / 2; i < this.inputsNum / 2; i++) {
            const pos = this.getPinPosition(i + this.inputsNum / 2, 'input');
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(pos.x, pos.y, SUBPIN_RADIUS, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            const val = this.inputs[i + this.inputsNum / 2];
            if (val == 'high') {
                ctx.shadowBlur = 10;
                ctx.shadowColor = HIGH_COLOR;
            }
            ctx.fillStyle = val == 'high' && this.getConnectionAt(i + this.inputsNum / 2) ? HIGH_COLOR : LOW_COLOR;
            ctx.arc(pos.x, pos.y, SUBPIN_RADIUS, 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        for (let j = -this.outputsNum / 2; j < this.outputsNum / 2; j++) {
            const pos = this.getPinPosition(j + this.outputsNum / 2, 'output');
            ctx.beginPath();
            ctx.fillStyle = this.color;
            ctx.arc(pos.x, pos.y, SUBPIN_RADIUS, 0, 2 * Math.PI);
            ctx.fill();
            ctx.beginPath();
            const val = this.outputs[j + this.outputsNum / 2];
            if (val == 'high') {
                ctx.shadowBlur = 10;
                ctx.shadowColor = HIGH_COLOR
            }
            ctx.fillStyle = val == 'high' ? HIGH_COLOR : LOW_COLOR;
            ctx.arc(pos.x, pos.y, SUBPIN_RADIUS, 0, 2 * Math.PI);
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        if (this.holding) {
            var t = '';
            if (this.tag == 'and') {
                t = 'only active if both inputs are active'
            } else if (this.tag == 'not') {
                t = 'inverses the input'
            } else {
                const prefab = Prefabs.find(prefab => prefab.name == this.tag);
                if (prefab) { t = prefab.desc || "" }
            }
            if (t.length > 0) {
                ctx.beginPath();
                ctx.fillStyle = "rgba(255,255,255,.8)";
                ctx.font = `normal ${FONT_SIZE/1.5}px Poppins`;
                ctx.fillText(t, mouse.position.x, mouse.position.y);
                
            }
        }

    }

}