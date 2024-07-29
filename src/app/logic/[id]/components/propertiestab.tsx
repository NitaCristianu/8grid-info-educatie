"use client";
import { motion } from 'framer-motion';
import { CANVAS_SIZE } from '../data/consts';
import useSize from '../hooks/useSize';
import styles from './propertiestab.module.css';
import { useEffect, useState } from 'react';
import { ChangingProps, SelectedElements } from '../data/vars';
import useMouse from '../hooks/useMouse';
import { Cips, Connections, Inputs, Outputs } from '../data/elements';

/*
    RESPONSIBLE FOR REMOVING ELEMENTS
    THAT ARE SELECTED
    see below
*/

function removeElementById(array: { id: string }[], id: string) {
    const index = array.findIndex(element => element.id == id);
    var i = 0;
    while (i < Connections.length) {
        if (Connections[i].start.location.id == id) {
            Connections.splice(i, 1);
        } else if (Connections[i].end.location.id == id) {
            Connections.splice(i, 1);
        }
        i++;
    }
    if (index !== -1) {
        array.splice(index, 1);
    }
}

export default function Properties() {
    const size = useSize();
    const [Visibility, setVisibility] = useState(false);
    const mouse = useMouse();

    useEffect(() => {
        setVisibility((SelectedElements.value as []).length > 0 || false);
    }, [SelectedElements.value, mouse])

    return <motion.div
        className={styles.gradientBorder}
        style={{
            position: 'fixed',
            height: size.y * .1,
            aspectRatio: 1,
            left: Visibility ? size.x * .93 : size.x,
            top: size.y / 2 - size.y * 0.05,
            opacity: Visibility ? 1 : 0,
            transition: 'opacity .3s ease-in-out, left .3s',
            display: 'flex',
            alignItems: 'center',
            flexDirection: 'column'
        }}
        onMouseEnter={() => {
            if (Visibility)
                ChangingProps.set(true);
        }}
        onMouseLeave={() => {
            if (Visibility)
                ChangingProps.set(false);
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onTap={() => {
            SelectedElements.value?.forEach((element) => {
                const connection = Connections.find(connection => connection.id == element);
                if (connection) {
                    const B = connection.end.location.id;
                    const index = Outputs.findIndex(out => out.id == B);
                    if (index > -1) {
                        Outputs[index].setFormula("");
                        Outputs[index].set("unset");
                    }
                }
                removeElementById(Inputs, element);
                removeElementById(Outputs, element);
                removeElementById(Cips, element);
                removeElementById(Connections, element);
            })
            SelectedElements.set([]);
            ChangingProps.reset();
        }}
    >
        <svg viewBox="0 0 24 24" fill="none">
            <g id="bin" strokeWidth="0"></g>
            <g id="bin" strokeLinecap="round" strokeLinejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path d="M10 12V17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M14 12V17" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M4 7H20" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                </path>
            </g>
        </svg>
    </motion.div>
}