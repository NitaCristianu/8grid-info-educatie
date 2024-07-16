"use client";
import { motion, MotionProps, MotionStyle } from 'framer-motion';
import { HTMLAttributes } from 'react';

export function TextTransition(props: { initial: string, after?: string, gapWords?: number, style?: MotionStyle }) {
    return <motion.h1
        initial={"initial"}
        whileHover={'hovered'}
        style={{
            fontFamily: "Poppins",
            overflow: "hidden",
            position: 'relative',
            display: 'block',
            whiteSpace: 'nowrap',
            gap: 20,
            ...props.style
        }}
        transition={{
            staggerChildren: .02,
        }}
    >
        <motion.div
            whileHover={{ cursor: "pointer" }}
        >
            {props.initial.split("").map((l: string, i: number) => {
                return <motion.span
                    key={i}
                    style={{
                        display: 'inline-block',
                        marginRight: l === " " ? `${props.gapWords || 0}px` : "0px",

                    }}
                    variants={{
                        initial: {
                            y: 0,
                        },
                        hovered: {
                            y: "-100%"
                        }
                    }}
                    transition={{
                        delay: 0.015 * i
                    }}
                >{l}</motion.span>
            })}
        </motion.div>
        <motion.div
            whileHover={{ cursor: "pointer" }}
            style={{
                position: "absolute",
                inset: 0
            }}
        >
            {(props.after || props.initial).split("").map((l: string, i: number) => {
                return <motion.span
                    style={{
                        display: 'inline-block',
                        marginRight: l === " " ? `${props.gapWords || 0}px` : "0px",
                    }}
                    transition={{
                        delay: 0.015 * i
                    }}
                    variants={{
                        initial: {
                            y: '100%',
                        },
                        hovered: {
                            y: "0%"
                        }
                    }}
                    key={i}
                >{l}</motion.span>
            })}
        </motion.div>
    </motion.h1>
}