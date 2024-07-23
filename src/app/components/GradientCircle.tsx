"use client";
import { motion } from 'framer-motion';

export default function GradientCircle(props: {
    x: string | number,
    y: string | number,
    size: string | number,
    color: string,
    color2?: string,
    opacity?: number,
    zIndex? : number
}) {
    return <motion.div
        style={{
            position: 'fixed',
            zIndex : props.zIndex || 'auto',
            opacity: props.opacity || 1,
            left: typeof (props.x) == 'number' ? `${Math.round(props.x * 100)}%` : props.x,
            top: typeof (props.y) == 'number' ? `${Math.round(props.y * 100)}%` : props.y,
            width: typeof (props.size) == 'number' ? `${Math.round(props.size * 100)}%` : props.size,
            aspectRatio: 1,
            mixBlendMode: 'hard-light',
            background: `radial-gradient(${props.color} 0%, #00000000 50%)`,
            userSelect: 'none',
            transition: "background 2.7s",
            pointerEvents: 'none'
        }}

    />
}