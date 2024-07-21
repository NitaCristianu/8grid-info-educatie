"use client"
import { useAtom } from "jotai"
import { ANCHORS, GRID_POSITION, vec2D } from "../../../data/globals";
import { motion } from "framer-motion";
import { anchor } from '../../../data/props';
import { Distance_Squared } from "../../../data/management";
import { useEffect, useState } from "react";
import useResize from "../../../hooks/useResize";
import { v4 } from "uuid";

function GetClosestAnchor(point: vec2D, anchors: anchor[]) {
    var min = Infinity;
    var closest = null;
    anchors.forEach(anchor => {
        const dist = Distance_Squared(point, anchor) / 10000;
        if (dist < min) {
            closest = anchor;
            min = dist;
        }
    })
    return closest;
}

export default function Achors() {
    const [anchors] = useAtom(ANCHORS);
    const size = useResize();
    const [offset, set_offset] = useAtom(GRID_POSITION);
    const [closest, set_closest] = useState<anchor | null>(null);

    // c = -o + s/2
    // c - a = 0
    // -o + s/2 = a
    // -o = a - s/2
    // o = s/2 - a

    useEffect(() => {
        set_closest(GetClosestAnchor({ x: -offset.x + size.x / 2, y: -offset.y + size.y / 2 }, anchors));
    }, [offset, anchors, size, set_closest, closest])

    const height = 80;

    return (<div
        style={{
            position: "fixed",
            width: '100%',
            height: height,
            top: `calc(100% - ${height + 10}px)`,
            justifyContent: 'center',
            display: 'flex',
            gap: '1.5rem',
            zIndex: 10

        }}
    >
        {...anchors.sort((a, b) => a.order - b.order).map(anchor => (
            <motion.div
                key={v4()}
                style={{
                    borderRadius: '0.8rem',
                    padding: '.5rem',
                    fontFamily: "Poppins",
                    fontWeight: 500,
                    fontSize: '1.5rem',
                    userSelect: 'none',
                    opacity: closest ? (closest.id == anchor.id ? 1 : 0.5) : 0.5
                }}
                whileHover={{
                    scale: 1.05,
                    marginLeft: 10,
                    marginRight: 10
                }}
                whileTap={{
                    scale: 1.15,
                }}
                onTap={() => {
                    set_offset({
                        x: size.x / 2 - anchor.x,
                        y: size.y / 2 - anchor.y
                    })
                }}
            >{anchor.tag}</motion.div>
        ))}
    </div>)
}