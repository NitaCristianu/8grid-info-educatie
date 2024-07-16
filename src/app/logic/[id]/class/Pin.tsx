import { voltage } from "../interfaces/keywords";
import { v4 } from 'uuid';
import { inCircle, inRect, randomChange255 } from "../utils/math";
import { MouseObject } from "../hooks/useMouse";
import { Inputs, Outputs } from "../data/elements";
import { ConstructionVar1, SelectedElements } from "../data/vars";
import { ComputeFormula } from "../utils/formulas";
import { convertRgbToRgba, increaseContrast } from "../utils/colors";
import { SELECT_COLOR } from "../data/consts";
import { cubicBezier } from "framer-motion/dom";

export const INDICATOR_RAD = 20;
export const SCREEN_BOUND = 0.07;
export const PIN_RADIUS = 10;
export const HIGH_COLOR = 'rgb(80,255,80)';
export const LOW_COLOR = 'rgb(93, 93, 93)';
export const LINE_WIDTH = 5;
export const PIN_END_COLOR = "rgb(5, 5, 10)";
export const HOLD_SHADOW_OFFSET = 5;
export const ROUNDNESS = 8;

export interface PinProps {
    value?: voltage,
    y: number,
    type: 'input' | 'output',
    name?: string,
    id?: string,
}

export default class Pin {

    public declare value;
    public declare id;
    public declare y;
    public declare type;
    public declare name;
    public declare selected;
    public declare hold;
    public declare x;
    public declare x2;
    public declare formula;
    public visibleT; // used as time in animations

    constructor(props: PinProps) {
        this.type = props.type;
        this.y = props.y;
        this.value = props.value || "unset";
        this.id = props.id || v4() as string;
        this.name = props.name || 'Pin';
        this.selected = false;
        this.hold = false;
        this.x = 0;
        this.x2 = 0;
        this.formula = ``;
        this.visibleT = 1;
    }

    set(value: voltage) { this.value = value }
    setFormula(formula: string) { this.formula = formula };
    rename(name: string) { this.name = name }
    opposite() { this.value = this.value == 'high' ? 'low' : 'high' }

    public update(mouse: MouseObject, prevMouse: MouseObject) {
        const mx = mouse.position.x;
        const my = mouse.position.y;
        const left = mouse.buttons.left;
        const prevLeft = prevMouse.buttons.left;
        const futureY = this.y + (my - prevMouse.position.y);
        const oncircle = inCircle(mx, my, this.x2, this.y, INDICATOR_RAD);
        const onrect = inRect(mx, my,
            (this.type == 'input' ? this.x2 - INDICATOR_RAD - HOLD_SHADOW_OFFSET / 2 : this.x - PIN_RADIUS * 2),
            this.y - INDICATOR_RAD - HOLD_SHADOW_OFFSET / 2,
            Math.abs(this.x - this.x2) + 2 * PIN_RADIUS + HOLD_SHADOW_OFFSET * 2,
            2 * INDICATOR_RAD + HOLD_SHADOW_OFFSET
        );
        const prx = mx / innerWidth; // procentage x

        if (this.type == 'input') {
            if (prx < 0.20) {
                if (prx < 0.05)
                    this.visibleT = 0;
                else
                    this.visibleT = ((prx - 0.05) / .15);
            } else
                this.visibleT = 1;

        } else {
            if (prx > 0.8) {
                if (prx > 0.95) this.visibleT = 0;
                else this.visibleT = 1 - ((prx - 0.8) / .15);
            } else this.visibleT = 1;
        }
        const isOverlapping = this.closestOtherPin(futureY) <= INDICATOR_RAD * 2 + HOLD_SHADOW_OFFSET;
        const isInside = futureY > INDICATOR_RAD * 2 && futureY < innerHeight * 0.84 - INDICATOR_RAD * 2;
        if (onrect && left) this.hold = true;
        else if (!left) this.hold = false;

        if (onrect && mouse.buttons.right && !prevMouse.buttons.right) {
            ConstructionVar1.set({ type: this.type, id: this.id, index: -1, subtype: "input" });
        }

        if (this.hold && !isOverlapping && isInside) this.y = futureY;
        if (oncircle && !left && prevMouse.buttons.left && this.type == "input") {
            this.opposite();
        }
        if (this.type == 'input') {
            var thisindex = Inputs.findIndex(inp => inp.id == this.id);
            this.formula = `${thisindex.toFixed(0)}`;
        }
        if (this.type == 'output' && this.formula.length > 0) {
            this.set(ComputeFormula(this.formula));
        }

        if (mouse.buttons.right && !onrect) {
            SelectedElements.set((SelectedElements.value as []).filter(el => el != this.id));
        } // REMEMBER OTHER CASES
        if (!mouse.buttons.doubleClick && prevMouse.buttons.doubleClick && onrect) {
            if (!(SelectedElements.value as []).find(el => el == this.id)) {
                SelectedElements.set([...SelectedElements.value as [], this.id]);
            }
        }
        this.selected = (SelectedElements.value as []).find(el => el == this.id) != undefined;
    }

    public getEndx() {
        return this.x + (this.x2 - this.x) * (this.visibleT);
    }

    public closestOtherPin(y?: number) {
        var pins: Pin[] = [];
        if (this.type == 'input') pins = [...Inputs];
        if (this.type == 'output') pins = [...Outputs];
        y = y || this.y || 0;
        var closest = Infinity;
        pins.forEach(pin => {
            if (pin.id == this.id) return;
            const distance = Math.abs(pin.y - (y ? y : 0));
            if (distance < closest) closest = distance;
        });
        return closest;
    }

    public draw(ctx: CanvasRenderingContext2D, screenWidth: number = 0) {
        this.x = this.type == 'input' ? screenWidth * SCREEN_BOUND / 1 : screenWidth * (1 - SCREEN_BOUND / 1);
        this.x2 = this.type == 'input' ? screenWidth * SCREEN_BOUND / 2 : screenWidth * (1 - SCREEN_BOUND / 2);
        const thisx = this.getEndx();
        const color = this.value == 'high' ? HIGH_COLOR : LOW_COLOR;

        const x = (this.type == 'input' ? this.x2 - INDICATOR_RAD - HOLD_SHADOW_OFFSET / 2 : thisx - PIN_RADIUS * 2);
        const y = this.y - INDICATOR_RAD - HOLD_SHADOW_OFFSET / 2;
        const w = Math.abs(this.x - this.x2) + 2 * PIN_RADIUS + HOLD_SHADOW_OFFSET * 2;
        const h = 2 * INDICATOR_RAD + HOLD_SHADOW_OFFSET;


        if (this.selected || this.hold) {
            ctx.beginPath();
            ctx.lineWidth = HOLD_SHADOW_OFFSET / 2;
            ctx.fillStyle = SELECT_COLOR;
            ctx.roundRect(
                x - (this.type == 'input' ? HOLD_SHADOW_OFFSET : -HOLD_SHADOW_OFFSET),
                y - HOLD_SHADOW_OFFSET,
                w + HOLD_SHADOW_OFFSET * 3,
                h + HOLD_SHADOW_OFFSET * 2,
                ROUNDNESS
            );
            ctx.fill();
            ctx.closePath();
        }

        ctx.beginPath();
        ctx.strokeStyle = PIN_END_COLOR;
        ctx.lineWidth = LINE_WIDTH;
        ctx.moveTo(thisx, this.y);
        ctx.lineTo(this.x2, this.y);
        ctx.stroke();



        ctx.beginPath();
        ctx.fillStyle = PIN_END_COLOR;
        ctx.arc(thisx, this.y, PIN_RADIUS, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.shadowBlur = 20;
        ctx.shadowColor = this.value == 'high' ? HIGH_COLOR : 'rgb(0,0,0.4)';
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x2, this.y, INDICATOR_RAD, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;

    }
}