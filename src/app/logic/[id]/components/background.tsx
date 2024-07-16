import { CANVAS_SIZE } from "../data/consts";
import { Position } from "../data/vars";

const GRID_SPACING = 30;

export default function Background(ctx: CanvasRenderingContext2D, screenSize: { x: number, y: number }) {

    const DOT_SIZE = 2;
    const BGR_COLOR = "rgb(20, 20, 25)";
    const DOT_COLOR = "rgba(70,70,80, 0.4)";
    const DOT_THICKNESS = 2;

    ctx.fillStyle = BGR_COLOR;
    ctx.fillRect(0, 0, screenSize.x, screenSize.y);
    const position = Position.value || {x : 0, y : 0};
    for (let x = position.x % GRID_SPACING; x < screenSize.x; x += GRID_SPACING) {
        for (let y = position.y & GRID_SPACING; y < screenSize.y; y += GRID_SPACING) {
            ctx.beginPath();
            ctx.strokeStyle = DOT_COLOR;
            ctx.lineWidth = DOT_THICKNESS;
            ctx.moveTo(x - DOT_SIZE, y);
            ctx.lineTo(x + DOT_SIZE, y);
            ctx.stroke();

            ctx.beginPath();
            ctx.strokeStyle = DOT_COLOR;
            ctx.lineWidth = DOT_THICKNESS;
            ctx.moveTo(x, y - DOT_SIZE);
            ctx.lineTo(x, y + DOT_SIZE);
            ctx.stroke();
        }
    }

}