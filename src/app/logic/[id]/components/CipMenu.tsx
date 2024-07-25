"use client"
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { ConstructionVar2, CreatingCustomChip } from '../data/vars';
import styles from './cipmenu.module.css';
import useFrame from '../hooks/useFrame';
import { convertRgbToRgba } from '../utils/colors';
import { Cips, Inputs, Outputs, Prefabs } from '../data/elements';
import ReactTextareaAutosize from 'react-textarea-autosize';

export default function CipMenu() {
    const [isVisible, setVisible] = useState<boolean>(CreatingCustomChip.value != null);
    const [CipColor, setCipColor] = useState<string>("#aaaaaa");
    const [CipDescription, setCipName] = useState<string>("");
    const [CipName, setCipDescription] = useState<string>("");



    useFrame(() => {
        setVisible(CreatingCustomChip.value != null);
    });

    return <>
        <div
            className={styles.bgr}

            style={{
                backdropFilter: isVisible ? 'blur(2px)' : 'none',
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
                    background: `radial-gradient(${CipColor}30,${"rgba(106, 95, 226, 0)"})`,
                    marginTop : "-90vh"
                }}
            />
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    height: '4rem',
                    gap: '1rem',
                    alignItems: 'center',
                }}
            >
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
                        padding: '0.5rem',
                        overflow: 'auto',
                        cursor: isVisible ? "auto" : 'default',
                        textAlign: 'center'
                    }}
                    type='text'
                    placeholder={"Name your cip"}
                    content={CipName}
                    onChange={e => {
                        setCipName(e.target.value);
                    }}

                />
            </div>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    alignItems: 'center',
                }}
            >
                <textarea
                    style={{
                        fontSize: 'large',
                        fontFamily: "Poppins",
                        fontWeight: 'normal',
                        pointerEvents: "all",
                        userSelect: "all",
                        border: '0px solid white',
                        width: '25vw',
                        outline: 'none',
                        background: 'none',
                        borderRadius: '1rem',
                        padding: '0.5rem',
                        overflow: 'auto',
                        cursor: isVisible ? "auto" : 'default',
                        textAlign: 'center',
                        resize: 'none'
                    }}
                    placeholder={"Describe your cip"}
                    content={CipDescription}
                    onChange={e => {
                        setCipDescription(e.target.value);
                    }}
                    

                />
            </div>
            <div>
                <input
                    type="color"
                    style={{
                        background: 'none',
                        outline: 'none',
                        border: 'none',
                        width: '5vw',
                        height: '5vh',
                        marginTop: '6vh',
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
                    animate={{
                        opacity: CipDescription.length > 0 ? 1 : 0,
                        color: CipColor,
                    }}
                    style={{
                        fontSize: 'xx-large',
                        fontFamily: "Poppins",
                        fontWeight: 'bolder',
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
                            name: CipDescription,
                            desc: CipName,
                            inputsNum: Inputs.length,
                            outputFormulas: Outputs.map(out => out.formula)
                        })
                        setCipName("");
                        setCipColor("#aaaaaa");
                        setCipDescription("");
                    }}
                >SAVE</motion.button>
                <motion.button
                    style={{
                        fontSize: 'xx-large',
                        fontFamily: "Poppins",
                        fontWeight: 'bolder',
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