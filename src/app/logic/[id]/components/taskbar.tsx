"use client"
import { motion } from 'framer-motion';
import styles from './taskbar.module.css';
import { convertRgbToRgba } from '../utils/colors';
import { useEffect, useRef, useState } from 'react';
import { ConstructionVar2, CreatingCustomChip, Position } from '../data/vars';
import useSize from '../hooks/useSize';
import useMouse from '../hooks/useMouse';
import { Cips, Connections, Inputs, Outputs, Prefabs } from '../data/elements';

export function Cell(props: { name: string, color: string, callBack: () => void }) {
    const color = props.color[0] == 'r' ? (convertRgbToRgba(props.color, 0.2)) : props.color + "33";
    const color2 = props.color[0] == 'r' ? (convertRgbToRgba(props.color, 0.4)) : props.color + "66";
    return <motion.button
        className={styles.cell}
        style={{
            backgroundColor: color,
            borderColor: props.color,
            boxShadow: `0px 0px 10px ${color}`,
        }}
        onClick={props.callBack}
        whileTap={{ scale: 1.05 }}
        whileHover={{ scale: 0.95, boxShadow: `0px 0px 30px ${color2}` }}
    > {props.name.toUpperCase()}</motion.button >
}

export default function Taskbar(props: {
    saveproject: (a: any) => Promise<void>
}) {
    const divRef = useRef<HTMLDivElement>(null);
    const size = useSize();
    const [posY, setY] = useState<boolean>(true);
    const mouse = useMouse();

    useEffect(() => {
        if (posY == false && mouse.buttons.left) {
            setY(true);
            ConstructionVar2.set(null);
        }
    }, [size, mouse, ConstructionVar2]);

    return <div>

        <div
            ref={divRef}
            className={styles.container}
            style={{
                top: posY ? .9 * size.y - 16 : size.y,
                transition: "top .3s ease-in-out"
            }}
        >
            <Cell
                key={"save_"}
                name='save post'
                color='rgb(36, 36, 36)'
                callBack={() => {
                    const input_data = Inputs.map(input => ({
                        y: input.y,
                        name: input.name,
                        id : input.id
                    }));
                    const output_data = Outputs.map(output => ({
                        y: output.y,
                        id : output.id,
                        name: output.name
                    }));
                    const prefabs_data = Prefabs.map(prefab => ({
                        inputsNum: prefab.inputsNum,
                        name: prefab.name,
                        outputFormulas: prefab.outputFormulas,
                        color: prefab.color,
                    }))
                    const cips_data = Cips.map(cip => ({
                        x: cip.x,
                        y: cip.y,
                        name: cip.tag,
                        id : cip.id,
                    }));
                    const connections_data = Connections.map(connection => ({
                        start: connection.start,
                        end: connection.end
                    }));
                    const data = {
                        inputs: input_data,
                        outputs: output_data,
                        prefabs: prefabs_data,
                        cips: cips_data,
                        connections: connections_data
                    }

                    props.saveproject(data)
                }}
            />
            <Cell key="+" name="+" callBack={() => {
                CreatingCustomChip.set(true);
            }}
                color="rgb(117, 241, 115)"
            />
            <Cell key="not" name="and" callBack={() => {
                if (ConstructionVar2.value == null && !CreatingCustomChip.value) {
                    ConstructionVar2.set("and");
                    setY(false);
                }

            }}
                color="rgb(61, 95, 248)" />
            <Cell key="and" name="not" callBack={() => {
                if (ConstructionVar2.value == null && !CreatingCustomChip.value) {
                    ConstructionVar2.set("not");
                    setY(false);
                }
            }}
                color="rgb(233, 69, 69)" />
            {Prefabs.map(prefab => (<Cell
                key={prefab.name}
                name={prefab.name}
                callBack={() => {
                    if (ConstructionVar2.value == null && !CreatingCustomChip.value) {
                        ConstructionVar2.set(prefab.name);
                        setY(false);
                    }
                }}
                color={prefab.color}
            />))}
        </div>
    </div>
}