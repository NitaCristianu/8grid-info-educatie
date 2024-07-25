import { v4 } from "uuid";
import { Cips, Inputs, Outputs } from "../data/elements";
import { voltage } from "../interfaces/keywords";
import { MouseObject } from "../hooks/useMouse";
import { SelectedElements } from "../data/vars";

export interface gateLocation {
    id: string, index?: number
}

export interface ConnectionStart {
    type: 'input' | 'gatepin',
    location: gateLocation
}

export interface ConnectionEnd {
    type: 'output' | 'gatepin',
    location: gateLocation
}
export interface ConnectionProps {
    start: ConnectionStart,
    end: ConnectionEnd,
    id?: string
};

const LINE_WIDTH = 5;
const HIGH_COLOR = 'rgba(80,255,80)';
const LOW_COLOR = 'grey';

export default class Connection {
    public declare start: ConnectionStart;
    public declare end: ConnectionEnd;

    public declare endx: number;
    public declare endy: number;
    public declare startx: number;
    public declare starty: number;
    public declare voltage: voltage;
    public declare startFormula: string;
    public declare id: string;
    public declare selected: boolean;

    constructor(props: ConnectionProps) {
        this.start = props.start;
        this.end = props.end;

        this.id = props.id || v4();
        this.startx = 0;
        this.starty = 0;
        this.endx = 0;
        this.endy = 0;
        this.voltage = 'low';
        this.startFormula = '';
        this.selected = false;
    }

    update(mouse: MouseObject, prevMouse: MouseObject) {
        var startVal = false;
        this.voltage = 'low';

        if (mouse.buttons.doubleClick) {
            const a = { x: this.startx, y: this.starty };
            const b = { x: this.endx, y: this.endy };
            const p = { ...mouse.position }

            const ab = { x: b.x - a.x, y: b.y - a.y };
            const ap = { x: p.x - a.x, y: p.y - a.y };
            const t = Math.max(0, Math.min((ab.x * ap.x + ab.y * ap.y) / (ab.x * ab.x + ab.y * ab.y), 1));
            const c = { x: a.x + t * ab.x, y: a.y + t * ab.y };
            const pc = { x: c.x - p.x, y: c.y - p.y };
            const dist = pc.x * pc.x + pc.y * pc.y;
            if (dist < LINE_WIDTH * LINE_WIDTH) {
                if (!SelectedElements.value?.find(s => s == this.id)) {
                    SelectedElements.set([...SelectedElements.value || [], this.id]);
                }
                this.selected = true;
            }
        }
        if (this.selected && mouse.buttons.right && prevMouse.buttons.right) {
            var index = (SelectedElements.value || []).findIndex(s => s == this.id);

            if (index > -1) {
                const value = (SelectedElements.value || []).filter(el => el != this.id);
                SelectedElements.set(value);
            }
            this.selected = false;
        }

        if (this.start.type == 'gatepin') {
            const startcip_index = Cips.findIndex(cip => cip.id == this.start.location.id);
            if (startcip_index > -1) {
                const cip = Cips[startcip_index];
                const startcip_input_value = cip.outputs[this.start.location.index || 0];
                startVal = (startcip_input_value == 'high');
                const startpos = cip.getPinPosition(this.start.location.index || 0, 'output');
                this.startx = startpos.x;
                this.starty = startpos.y;
                this.startFormula = cip.outputFormulas[this.start.location.index || 0];
            }
        } else {
            const input = Inputs.find(i => i.id == this.start.location.id);
            startVal = input?.value == "high";
            if (input) {
                this.startFormula = input.formula;
                this.startx = input.getEndx();
                this.starty = input.y;
            }
        }
        this.voltage = startVal ? 'high' : 'low';
        if (this.end.type == 'gatepin') {
            const endcip_index = Cips.findIndex(cip => cip.id == this.end.location.id);
            if (endcip_index > -1) {
                Cips[endcip_index].setInput(this.end.location.index || 0, startVal ? "high" : "low");
                const endpos = Cips[endcip_index].getPinPosition(this.end.location.index || 0, 'input');
                this.endx = endpos.x;
                this.endy = endpos.y;
            }
        } else {
            const output_index = Outputs.findIndex(out => out.id == this.end.location.id);
            if (output_index > -1) {
                Outputs[output_index].set(startVal ? 'high' : 'low');
                Outputs[output_index].setFormula(this.startFormula);
                this.endx = Outputs[Outputs.findIndex(out => out.id == this.end.location.id)].getEndx();
                this.endy = Outputs[Outputs.findIndex(out => out.id == this.end.location.id)].y;
            }
        }

    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        if (this.voltage == 'high') {
            ctx.shadowBlur = 10;
            ctx.shadowColor = HIGH_COLOR;
        }
        ctx.strokeStyle = this.voltage == 'high' ? HIGH_COLOR : LOW_COLOR;
        ctx.lineWidth = LINE_WIDTH;
        ctx.moveTo(this.startx, this.starty);
        ctx.lineTo(this.endx, this.endy);
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (this.selected) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(255,255,255,0.7)";
            ctx.lineWidth = LINE_WIDTH * 1.5;
            ctx.moveTo(this.startx, this.starty);
            ctx.lineTo(this.endx, this.endy);
            ctx.stroke();

        }
    }

}