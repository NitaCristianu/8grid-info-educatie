import { HOLD_SHADOW_OFFSET } from "../class/Cip";
import Pin, { INDICATOR_RAD, PIN_RADIUS, SCREEN_BOUND } from "../class/Pin";
import { Inputs, Outputs } from "../data/elements";
import { MouseObject } from "../hooks/useMouse";

export default function (ctx: CanvasRenderingContext2D, size: { x: number, y: number }, mouse: MouseObject, prevMouse: MouseObject) {
    const w = Math.abs(size.x * SCREEN_BOUND - size.x * SCREEN_BOUND / 2) + 2 * PIN_RADIUS + HOLD_SHADOW_OFFSET * 2;
    const h = 2 * INDICATOR_RAD + HOLD_SHADOW_OFFSET;
    if (mouse.position.x / size.x < 0.03 && mouse.position.y < 0.87 * size.y) {
        var canPlace = true;
        Inputs.forEach(input => canPlace = canPlace && Math.abs(input.y - mouse.position.y) > h);
        if (mouse.buttons.left && !prevMouse.buttons.left && canPlace) {
            Inputs.push(new Pin({
                y: mouse.position.y,
                type: 'input',
            }));
        }
        ctx.beginPath();
        var color = canPlace ? "rgba(148, 232, 145, 0.29)" : "rgba(216, 94, 94, 0.45)";

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        const x = size.x * SCREEN_BOUND / 2 - INDICATOR_RAD - HOLD_SHADOW_OFFSET / 2;
        const y = mouse.position.y - INDICATOR_RAD - HOLD_SHADOW_OFFSET / 2;
        ctx.roundRect(x, y, w, h, 16);
        ctx.fill();
        ctx.shadowBlur = 0;

    }

    if (mouse.position.x / size.x > 0.97 && mouse.position.y < 0.87 * size.y) {
        var canPlace = true;
        Outputs.forEach(output => canPlace = canPlace && Math.abs(output.y - mouse.position.y) > h);
        if (mouse.buttons.left && !prevMouse.buttons.left && canPlace) {
            Outputs.push(new Pin({
                y: mouse.position.y,
                type: 'output',
            }));
        }
        ctx.beginPath();
        var color = canPlace ? "rgba(148, 232, 145, 0.29)" : "rgba(216, 94, 94, 0.45)";

        ctx.fillStyle = color;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        const x = size.x * (1-SCREEN_BOUND) - PIN_RADIUS / 2 - HOLD_SHADOW_OFFSET;
        const y = mouse.position.y - INDICATOR_RAD - HOLD_SHADOW_OFFSET / 2;
        ctx.roundRect(x, y, w, h, 16);
        ctx.fill();
        ctx.shadowBlur = 0;

    }
}