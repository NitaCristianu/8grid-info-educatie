"use client";
import { useAtom } from "jotai"
import { ANCHORS, CAN_SELECT, GRID_POSITION, HOVERING_LABELS, vec2D } from "../../../data/globals"
import { motion } from "framer-motion";
import { toGlobal, transparent } from "../../../data/management";
import { ChangeEvent, useEffect, useState } from "react";
import { usePrevious } from "../../../hooks/usePrevious";
import ReactTextareaAutosize from 'react-textarea-autosize';
export default function Achors() {
    const [anchors, setAnchors] = useAtom(ANCHORS);
    const [offset] = useAtom(GRID_POSITION);
    const [dragging, setDragging] = useState<string>("");
    const [mpos, SetMpos] = useState<vec2D>({ 'x': 0, 'y': 0 });
    const prevMpos = usePrevious(mpos);
    const [hovering_labels, set_hovering_labels] = useAtom(HOVERING_LABELS);
    const [inEdit, setInEdit] = useState("");

    useEffect(() => {
        const m_move = (event: MouseEvent) => {
            SetMpos({ x: event.clientX, y: event.clientY });
            if (dragging == "") return;
            setAnchors(prev => {
                const clone = [...prev];
                const pos = toGlobal({ x: event.clientX, y: event.clientY }, offset);
                clone[clone.findIndex(a => a.id == dragging)].x = pos.x;
                clone[clone.findIndex(a => a.id == dragging)].y = pos.y;
                return clone;
            })
        }
        const m_up = (event: MouseEvent) => {
            if (event.button == 2) {
                setInEdit("");
            }
            setDragging("");
        }
        window.addEventListener("mousemove", m_move);
        window.addEventListener("mouseup", m_up);
        return () => {
            window.removeEventListener("mousemove", m_move);
            window.removeEventListener("mousedown", m_up);
        }
    }, [dragging])

    return (<div style={{ zIndex: 10 }} >
        {...anchors.map(anchor => (

            <>
                <motion.div
                    style={{
                        width: '2rem',
                        aspectRatio: 1,
                        background: 'black',
                        border: '2px solid rgb(173, 241, 246)',
                        position: 'fixed',
                        borderRadius: '100%',
                        top: offset.y + anchor.y - 8,
                        left: offset.x + anchor.x - 8,
                        zIndex: 7
                    }}
                    whileHover={{
                        scale: 1.05
                    }}
                    whileTap={{
                        scale: 0.95
                    }}
                    onTapStart={() => {
                        setDragging(anchor.id);
                        setInEdit(anchor.id);
                    }}
                    onHoverStart={() => {
                        if (!hovering_labels.includes(anchor.id)) {
                            set_hovering_labels(prev => [...prev, anchor.id]);
                        }
                    }}
                    onHoverEnd={() => {
                        set_hovering_labels(prev => {
                            const clone = [...prev];
                            clone.splice(clone.findIndex(g => g == anchor.id));
                            return clone;
                        });
                    }}
                >
                    <svg style={{
                        position: "fixed",
                        marginLeft: '2rem',
                        marginBottom: '2rem',
                    }} xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24" fill="rgb(173, 241, 246)">
                        <g id="SVGRepo_bgCarrier" stroke-width="0" />
                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                        <g id="SVGRepo_iconCarrier">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M13 6.82929C14.1652 6.41746 15 5.30622 15 4C15 2.34315 13.6568 1 12 1C10.3431 1 8.99999 2.34315 8.99999 4C8.99999 5.30622 9.8348 6.41746 11 6.82929V9H9.99999C9.44771 9 8.99999 9.44771 8.99999 10C8.99999 10.5523 9.44771 11 9.99999 11H11V20.9513C9.6854 20.8184 8.69059 20.4252 7.92969 19.9179C6.98043 19.2851 6.33511 18.4342 5.89442 17.5528C5.45178 16.6675 5.22547 15.7701 5.11139 15.0856C5.10656 15.0566 5.10194 15.0281 5.09752 15H5.99999C6.55228 15 6.99999 14.5523 6.99999 14C6.99999 13.4477 6.55228 13 5.99999 13H3.99999C3.37285 13 2.98297 13.5373 3.0025 14.1232C3.00953 14.3341 3.03602 14.7989 3.1386 15.4144C3.27451 16.2299 3.54821 17.3325 4.10557 18.4472C4.66488 19.5658 5.51956 20.7149 6.82029 21.5821C8.12729 22.4534 9.82501 23 12 23C14.175 23 15.8727 22.4534 17.1797 21.5821C18.4804 20.7149 19.3351 19.5658 19.8944 18.4472C20.4518 17.3325 20.7255 16.2299 20.8614 15.4144C20.964 14.7989 20.9905 14.3341 20.9975 14.1232C21.017 13.5373 20.6272 13 20 13H18C17.4477 13 17 13.4477 17 14C17 14.5523 17.4477 15 18 15H18.9025C18.898 15.0281 18.8934 15.0566 18.8886 15.0856C18.7745 15.7701 18.5482 16.6675 18.1056 17.5528C17.6649 18.4342 17.0196 19.2851 16.0703 19.9179C15.3094 20.4252 14.3146 20.8184 13 20.9513V11H14C14.5523 11 15 10.5523 15 10C15 9.44771 14.5523 9 14 9H13V6.82929ZM12 5.04921C11.4205 5.04921 10.9508 4.57946 10.9508 4C10.9508 3.42054 11.4205 2.95079 12 2.95079C12.5795 2.95079 13.0492 3.42054 13.0492 4C13.0492 4.57946 12.5795 5.04921 12 5.04921Z" />
                        </g>
                    </svg>
                    <p
                        style={{
                            position: 'fixed',
                            marginLeft: 11,
                            textAlign: 'center',
                            marginTop: 2,
                            fontFamily: 'Poppins',
                            fontWeight: 700,
                            color: "rgb(173, 251, 246)",
                            userSelect: 'none'
                        }}
                    >{anchor.order}</p>
                </motion.div>
                {inEdit == anchor.id ?
                    <div
                        style={{
                            position: "fixed",
                            zIndex: 7,
                            height: 5 * 16,
                            top: offset.y + anchor.y - 25,
                            left: offset.x + anchor.x + 55,
                            aspectRatio: 2.5,
                        }}
                    >

                        <ReactTextareaAutosize
                            style={{
                                resize: 'none',
                                background: 'rgba(4, 4, 14, .6)',
                                backdropFilter: 'blur(6px)',
                                borderRadius: '.8rem',
                                padding: 5,
                                border: '1px solid rgb(210, 210, 210)'
                            }}
                            placeholder="Enter a tag"
                            value={anchor.tag}
                            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                                const clone = [...anchors];
                                clone[clone.findIndex(a => a.id == anchor.id)].tag = event.target.value || "";
                                setAnchors(clone);
                            }}
                        />
                        <input
                            title="num-inp"
                            type="number"
                            value={anchor.order}
                            style={{
                                resize: 'none',
                                width: '20%',
                                background: 'rgba(4, 4, 14, .6)',
                                backdropFilter: 'blur(6px)',
                                borderRadius: '.8rem',
                                padding: 5,
                                border: '1px solid rgb(210, 210, 210)'
                            }}
                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                const clone = [...anchors];
                                clone[clone.findIndex(a => a.id == anchor.id)].order = parseInt(event.target.value) || 0;
                                setAnchors(clone);
                            }}
                        ></input>

                        <motion.div
                            whileHover={{ rotate: 3, scale: 0.9 }}
                            whileTap={{ scale: 1.1 }}
                            style={{
                                marginTop: 6,
                                aspectRatio: 1,
                                height: 16 * 2.5,
                                background: "rgba(4,4,14,.6)",
                                WebkitBackdropFilter: "blur(6px)",
                                backdropFilter: "blur(6px)",
                                border: "1px solid rgb(196, 196, 196)",
                                padding: 5,
                                borderRadius: ".3rem",
                            }}
                            onClick={() => {
                                var clone = [...anchors];
                                const i = clone.findIndex(a=>a.id == anchor.id);
                                clone.splice(i, 1);
                                setAnchors(clone);
                            }}
                        >

                            <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" width="1.5rem" height="1.5rem">
                                <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 4.3652344 7 L 6.0683594 22 L 17.931641 22 L 19.634766 7 L 4.3652344 7 z" />
                            </svg>
                        </motion.div>
                    </div> : null}
            </>
        ))
        }
    </div>)
}