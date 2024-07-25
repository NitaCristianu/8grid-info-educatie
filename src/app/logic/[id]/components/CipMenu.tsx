"use client"
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ConstructionVar2, CreatingCustomChip } from '../data/vars';
import styles from './cipmenu.module.css';
import useFrame from '../hooks/useFrame';
import { convertRgbToRgba } from '../utils/colors';
import { Cips, Inputs, Outputs, Prefabs } from '../data/elements';

export default function CipMenu() {
    const [isVisible, setVisible] = useState<boolean>(CreatingCustomChip.value != null);
    const [CipColor, setCipColor] = useState<string>("#ff0000");
    const [CipName, setCipName] = useState<string>("My Div");



    useFrame(() => {
        setVisible(CreatingCustomChip.value != null);
    });

    return <>
        <div
            className={styles.bgr}
            style={{
                backdropFilter: isVisible ? 'blur(7px)' : 'none',
                transition: 'backdropFilter 0.4s ease-in-out',


            }}
        >
        </div>
        <div
            style={{
                opacity: isVisible ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
                pointerEvents: isVisible ? 'all' : 'none',
            }}
            onContextMenu={(event) => event.preventDefault()}
            className={styles.menu}
        >
            <div
                className={styles.menubgr}
                style={{
                    background: `radial-gradient(${CipColor}30,${"rgba(106, 95, 226, 0.24)"})`,
                }}
            />
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    height: '4rem',
                    gap: '1rem',
                    alignItems: 'center',
                }}
            >

                <h1
                    style={{
                        fontSize: 'xx-large',
                        fontFamily: "Poppins",
                        fontWeight: 'light',
                    }}
                >Name your cip:</h1>
                <input
                    style={{
                        fontSize: 'xx-large',
                        fontFamily: "Poppins",
                        fontWeight: 'bolder',
                        pointerEvents: "all",
                        userSelect: "all",
                        border: '0px solid white',
                        outline: 'none',
                        background: 'none',
                        borderRadius: '1rem',
                        width: Math.max(CipName.length * 16, 12 * 16),
                        padding: '0.5rem',
                        overflow: 'auto',
                        cursor: isVisible ? "auto" : 'default',
                    }}
                    type='text'
                    placeholder={CipName}
                    content={CipName}
                    onChange={e => {
                        setCipName(e.target.value);
                    }}
                    contentEditable

                />
            </div>
            <div>
                <input
                    type="color"
                    style={{
                        background: 'none',
                        outline: 'none',
                        border: 'none',
                        width: '5rem',
                        height: '3rem',
                        borderRadius: 32
                    }}
                    value={CipColor}
                    onChange={e => { setCipColor(e.target.value) }}
                />

            </div>

            <div
                style={{
                    position: 'fixed',
                    top: '90%',
                    display: 'flex',
                    gap: '3rem'
                }}
            >
                <motion.button
                    style={{
                        fontSize: 'xx-large',
                        fontFamily: "Poppins",
                        fontWeight: 'bolder',
                        transition: 'opacity 0.3s ease-in-out',
                        opacity: CipName.length > 0 ? 1 : 0,
                        color: "rgb(153, 232, 171)",
                        textShadow: "0px 0px 10px rgba(97, 226, 101, 0.69)",
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: .95 }}
                    onClick={() => {
                        CreatingCustomChip.reset();
                        // Inputs.splice(0, Inputs.length);
                        // Outputs.splice(0, Outputs.length);
                        // Cips.splice(0, Cips.length);
                        Prefabs.push({
                            color: CipColor,
                            name: CipName,
                            inputsNum: Inputs.length,
                            outputFormulas: Outputs.map(out => out.formula)
                        })
                    }}
                >SAVE</motion.button>
                <motion.button
                    style={{
                        fontSize: 'xx-large',
                        fontFamily: "Poppins",
                        fontWeight: 'bolder',
                        color: "rgb(238, 112, 112)",
                        textShadow: "0px 0px 10px red",
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: .95 }}
                    onClick={() => {
                        CreatingCustomChip.reset();
                    }}
                >EXIT</motion.button>

            </div>

        </div>
    </>
} 