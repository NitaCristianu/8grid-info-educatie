import And from "../class/And";
import CustomChip from "../class/CustomChip";
import Not from "../class/Not";
import { Cips, Inputs, Outputs, Prefabs } from "../data/elements";
import { constructs, Position } from "../data/vars";
import { MouseObject } from "../hooks/useMouse";

/*
USED FOR HIGLIGHING AND PLACING CIPS BOTH CUSTOM AND PREMADE
*/

export default function Placement(val: constructs | null, ctx: CanvasRenderingContext2D, mouse: MouseObject, prevMouse: MouseObject) {
    const position = Position.value || { x: 0, y: 0 };
    const mpos = { x: mouse.position.x - position.x, y : mouse.position.y - position.y };
    if (mouse.buttons.left && !prevMouse.buttons.left) {
        if (val == 'and') Cips.push(new And({ ...mpos }));
        if (val == 'not') Cips.push(new Not({ ...mpos }));
        const prefab = Prefabs.find(prefab=>prefab.name == val);
        if (prefab){
            Cips.push(new CustomChip({
                inputsNum : prefab.inputsNum,
                outputFormulas : prefab.outputFormulas,
                color : prefab.color,
                tag : prefab.name,
                ...mpos
            }))
        }
    }
}