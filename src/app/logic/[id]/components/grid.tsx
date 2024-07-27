'use client';
// the grid includes inputs, outputs, and, not, custom chips
// the respectives classes are found in the class folder

import { useEffect, useRef } from "react";
import useMouse, { MouseObject } from "../hooks/useMouse";
import useSize from "../hooks/useSize"
import { Cips, Connections, Inputs, Outputs, Prefabs } from "../data/elements";
import { usePrevious } from "../hooks/usePrevious";
import Background from "./background";
import { ChangingProps, ConstructionVar1, ConstructionVar2, CreatingCustomChip, Position } from "../data/vars";
import Connection from "../class/Connection";
import { CANVAS_SIZE } from "../data/consts";
import Placement from "./highlight";
import placingpins from "./placingpins";
import { Sim_data } from "../page";
import Pin from "../class/Pin";
import And from "../class/And";
import Not from "../class/Not";
import CustomChip from "../class/CustomChip";

export default function Grid(props: { isEditable: boolean, data: Sim_data | null }) {
    const size = useSize();
    const mouse = useMouse();
    const prevMouse = usePrevious(mouse) as MouseObject;
    const ref = useRef<HTMLCanvasElement | null>(null);

    // The detector for lines
    useEffect(() => {
        const ctx = ref.current?.getContext('2d');
        if (ctx == null || ctx == undefined) return;
        if (!props.isEditable) return;
        if (ConstructionVar1.value == ConstructionVar1.old) return;
        if (ConstructionVar1.value == null) return;
        if (ConstructionVar1.old != null) {
            // create connection
            const startype = ConstructionVar1.old.type == 'gatetype' ? 'gatepin' : 'input';
            const endtype = ConstructionVar1.value.type == 'gatetype' ? 'gatepin' : 'output';

            if (ConstructionVar1.old.type == 'output') return;
            const start = ConstructionVar1.value;
            var x = 0;
            var y = 0;
            if (start.type == 'gatetype') {
                const startcip_index = Cips.findIndex(cip => cip.id == start.id);
                if (startcip_index > -1) {
                    const cip = Cips[startcip_index];
                    const startpos = cip.getPinPosition(start.index || 0, 'output');
                    x = startpos.x;
                    y = startpos.y;
                }
            } else {
                const input = Inputs.find(i => i.id == start.id);
                if (input) {
                    x = input.getEndx();
                    y = input.y;
                }
            }

            ctx.beginPath();
            ctx.setLineDash([15, 15]);
            ctx.strokeStyle = "rgba(255,255,255,0.3)";
            ctx.moveTo(x, y);
            ctx.lineTo(mouse.position.x, mouse.position.y);
            ctx.stroke();
            if (ConstructionVar1.old.id == ConstructionVar1.value.id) return;
            if (ConstructionVar1.old.type == 'gatetype' && ConstructionVar1.old.subtype == 'input') return;
            if (ConstructionVar1.value.type == 'gatetype' && ConstructionVar1.value.subtype == 'output') return;


            Connections.push(new Connection({
                start: { type: startype, location: { id: ConstructionVar1.old.id, index: ConstructionVar1.old.index } },
                end: { type: endtype, location: { id: ConstructionVar1.value.id, index: ConstructionVar1.value.index } }
            }));
            ConstructionVar1.reset();
        }

    }, [ConstructionVar1.value, mouse])

    const content = props.data;
    useEffect(() => {
        Connections.splice(0, Connections.length);
        Inputs.splice(0, Inputs.length);
        Outputs.splice(0, Outputs.length);
        Cips.splice(0, Cips.length);
        Prefabs.splice(0, Prefabs.length);
        if (content && content.inputs) {
            content.inputs.forEach(input => {
                Inputs.push(new Pin({ y: input.y, name: input.name, type: 'input', id: input.id }));
            })
            content.outputs.forEach(output => {
                Outputs.push(new Pin({ y: output.y, name: output.name, type: 'output', id: output.id }));
            })
            content.prefabs.forEach(prefab => {
                console.log(prefab)
                Prefabs.push({
                    color: prefab.color,
                    name: prefab.name,
                    desc: (prefab.desc || ""),
                    inputsNum: prefab.inputsNum,
                    outputFormulas: prefab.outputFormulas
                })
            })

            content.cips.forEach(cip => {
                if (cip.name.toLowerCase() == "and") {
                    Cips.push(new And({ x: cip.x, y: cip.y, id: cip.id }));
                } else if (cip.name.toLowerCase() == "not") {
                    Cips.push(new Not({ x: cip.x, y: cip.y, id: cip.id }));
                } else if (content.prefabs.find(prefab => prefab.name == cip.name)) {
                    const prefab = content.prefabs.find(prefab => cip.name == prefab.name);
                    if (prefab)
                        Cips.push(new CustomChip({ x: cip.x, y: cip.y, id: cip.id, inputsNum: prefab.inputsNum, outputFormulas: prefab.outputFormulas, tag: prefab.name, color: prefab.color }));
                }
            })
            content.connections.forEach(connection => {
                Connections.push(new Connection({ start: connection.start, end: connection.end }));
            })
        }
    }, [content]);

    // Update and render useEffect
    useEffect(() => {
        const ctx = ref.current?.getContext('2d');
        if (ctx == null || ctx == undefined) return;
        if (ref.current) {
            ref.current.width = size.x;
            ref.current.height = size.y;
        }

        Background(ctx, { x: size.x * CANVAS_SIZE[0], y: size.y * CANVAS_SIZE[1] });
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        if (!ConstructionVar2.value && !CreatingCustomChip.value && !ChangingProps.value) {
            // UPDAING EVERY ELEMENT
            Connections.forEach(connection => connection.update(mouse, prevMouse));
            Cips.forEach(cip => cip.update(mouse, prevMouse));
            Inputs.forEach(input => input.update(mouse, prevMouse));
            Outputs.forEach(input => input.update(mouse, prevMouse));
            if (props.isEditable)
                placingpins(ctx, size, mouse, prevMouse);
        }

        // DRAWING EVERY ELEMENT
        Connections.forEach(connection => connection.draw(ctx));
        Cips.forEach(cip => cip.draw(ctx, mouse));
        Inputs.forEach(input => input.draw(ctx, size.x * CANVAS_SIZE[0]));
        Outputs.forEach(input => input.draw(ctx, size.x * CANVAS_SIZE[0]));

        // Position Movement
        if (mouse.buttons.middle) {
            const delta = { x: mouse.position.x - prevMouse.position.x, y: mouse.position.y - prevMouse.position.y };
            Position.set({ x: delta.x + (Position.value?.x || 0), y: delta.y + (Position.value?.y || 0) });
        }

        if (props.isEditable)
            // Highlight
            Placement(ConstructionVar2.value, ctx, mouse, prevMouse);

    }, [size, prevMouse, mouse, Position.value, ConstructionVar2.value])

    return (<canvas
        ref={ref}
        width={size.x}
        height={size.y}
        onContextMenu={(event) => event.preventDefault()}
    />)
}