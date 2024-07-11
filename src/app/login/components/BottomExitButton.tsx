"use client";
import {motion} from 'framer-motion';

export default function ExitButton() {
    return <div
        style={{
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            display: 'flex',
            zIndex : 2
        }}
    >
        <motion.button
            style={{

            }}
        >Return Home</motion.button>
    </div>
}