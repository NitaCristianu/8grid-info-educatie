"use client"
import { motion } from "framer-motion";
import style from "./styles.module.css";
import { useAtom } from "jotai";
import { ACCENT, ANCHORS, GRID_POSITION, MODE, POINT_RADIUS, SELECTED, VARIABLES, blocks, mode } from "@/app/math/[id]/data/globals";
import { useEffect, useRef, useState } from "react";
import useResize from "@/app/math/[id]/hooks/useResize";
import { AddPoint, Distance_Squared, DoesSegmentExist, GetAnyHoveringPoint, GetHoveringPoint, ObtainPosition, getCoords, getUniqueTag, toGlobal, toLocal, transparent } from "@/app/math/[id]/data/management";
import { ePoints_Calc_data, ePoints_data, eSegments_data, GRAPHS, labels_data } from "@/app/math/[id]/data/elements";
import { v4 } from "uuid";
import { segment_render_mode, tips } from "@/app/math/[id]/data/props";
import { BACKGROUND } from '../../../data/globals';
import { Niconne } from "next/font/google";

export default function EuclidianGallery() {
    const [placing, setPlacing] = useState(null);
    const [current_mode, set_mode] = useAtom<mode>(MODE);

    const essentials: blocks[] = ["ePoint", "eSegment", "label", "graph", "anchor", "calc"];

    const [accent, __] = useAtom(ACCENT);
    const [bgr, ___] = useAtom(BACKGROUND);

    const canvas_ref = useRef<HTMLCanvasElement>(null);
    const gallery_ref = useRef<HTMLDivElement>(null);
    const size = useResize();
    const [mpos, set_mpos] = useState({ 'x': 0, 'y': 0 });
    const [offset, _] = useAtom(GRID_POSITION);

    const [points_data, set_points_data] = useAtom(ePoints_data);
    const [points_calc_data, set_points_calc_data] = useAtom(ePoints_Calc_data);
    const [segments_data, set_segmments_data] = useAtom(eSegments_data);
    const [labels, set_labels] = useAtom(labels_data);
    const [graph, set_graph] = useAtom(GRAPHS);
    const [inuse, set_inuse] = useState<string[]>([]);
    const [anchors, set_anchors] = useAtom(ANCHORS);
    const [variables, set_variables] = useAtom(VARIABLES);

    useEffect(() => {
        const canvas = canvas_ref.current as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.width = size.x;
        canvas.height = size.y;

        ctx.fillStyle = accent;
        ctx.strokeStyle = accent;
        ctx.shadowBlur = 10;
        ctx.shadowColor = accent;
        ctx.lineWidth = 5;

        const offseted_mpos = toGlobal(mpos, offset);
        const { isHovering, Hovering_id, isCalculated } = GetAnyHoveringPoint(offseted_mpos, points_data, points_calc_data, variables);

        if (current_mode != "euclidian") return;
        ctx.beginPath();


        if (placing == "label") {
            ctx.fillStyle = transparent(accent, 0.4);
            ctx.rect(mpos.x, mpos.y, 30 * 16, 4 * 16);
            ctx.fill();
            ctx.closePath();
        }

        var coords;
        var lineto = { x: 0, y: 0 };
        if ((placing == "eCenter" || placing == "ePerpendicular" || placing == "eSegment") && inuse.length > 0) {
            var index = points_data.findIndex(p => p.id == inuse.at(inuse.length - 1));
            if (index == -1) {
                index = points_calc_data.findIndex(p => p.id == inuse.at(inuse.length - 1));
                if (index > -1)
                    coords = ObtainPosition(points_calc_data[index].formula, points_data, points_calc_data, variables);
            } else {
                coords = getCoords(points_data[index]);
            }
            ctx.beginPath();
            coords = toLocal(coords || { x: 0, y: 0 }, offset);
            ctx.moveTo(coords.x, coords.y);
            if (isHovering) {
                let index = (points_data.findIndex(p => p.id == Hovering_id))
                var x, y;
                if (isCalculated) {
                    index = points_calc_data.findIndex(p => p.id == Hovering_id);
                    const pos = ObtainPosition(points_calc_data[index].formula, points_data, points_calc_data, variables);
                    x = pos.x;
                    y = pos.y;
                } else {
                    const pos = getCoords(points_data[index]);
                    x = pos.x;
                    y = pos.y;
                }
                const transformed = toLocal({ x: x, y: y }, offset);
                lineto = transformed;
            } else
                lineto = mpos;


            ctx.lineTo(lineto.x, lineto.y);

        }
        ctx.stroke();
        ctx.closePath();
        if (placing == "eCenter" && coords && isHovering) {
            ctx.beginPath();
            ctx.strokeStyle = "rgb(38, 76, 246)";
            ctx.arc((coords.x + lineto.x) / 2, (coords.y + lineto.y) / 2, POINT_RADIUS, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.fillStyle = "rgb(254, 254, 255)";
            ctx.arc((coords.x + lineto.x) / 2, (coords.y + lineto.y) / 2, POINT_RADIUS * .75, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
        if (!isHovering && (placing == "ePoint" || placing == "eSegment" || placing == "calc")) {
            ctx.beginPath();
            ctx.arc(mpos.x, mpos.y, POINT_RADIUS * 0.75, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.arc(mpos.x, mpos.y, POINT_RADIUS, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.closePath();
        }
    }, [inuse, size, mpos, placing, offset, points_data, accent, current_mode, points_calc_data, variables])

    useEffect(() => {
        const mouseDown = (event: MouseEvent) => {
            if (current_mode != "euclidian") return;
            const rect = gallery_ref.current != null ? gallery_ref.current.getBoundingClientRect() : null;
            if (rect && rect.left < event.clientX &&
                rect.right > event.clientX &&
                rect.top < event.clientY &&
                rect.bottom > event.clientY) return;
            const offseted_mpos = toGlobal(mpos, offset);
            const { isHovering, Hovering_id, isCalculated } = GetAnyHoveringPoint(offseted_mpos, points_data, points_calc_data, variables);
            if (
                (current_mode == "euclidian" && event.clientX > size.x * 0.69) ||
                (event.clientX < 16 * 8)
            ) return;
            if (placing == "ePoint" && event.button == 0) {
                if (!isHovering) {
                    set_points_data(prev => [...prev, {
                        x: offseted_mpos.x,
                        y: offseted_mpos.y,
                        id: v4(),
                        color: accent,
                        tag: getUniqueTag(points_data, points_calc_data)
                    }]);
                }
            } else if (placing == "eSegment") {
                if (inuse.length > 0 && event.button == 0) {
                    if (isHovering) {
                        const type: segment_render_mode = "only-segment";
                        const segment = {
                            from: inuse.at(inuse.length - 1) || "",
                            to: Hovering_id,
                            id: v4(),
                            color: "white",
                            renderMode: type
                        }
                        if (!DoesSegmentExist(segment, segments_data)) {
                            set_segmments_data(prev => [...prev, segment])
                            set_inuse(prev => [...prev, Hovering_id]);
                        }

                    } else if (event.button == 0) {
                        const new_point_id = v4();
                        // no need to verify wheter the semgent exists because a new unique point is created
                        set_points_data(prev => [...prev, {
                            x: offseted_mpos.x,
                            y: offseted_mpos.y,
                            id: new_point_id,
                            color: "white",
                            tag: getUniqueTag(points_data, points_calc_data)
                        }])
                        set_segmments_data(prev => [...prev, {
                            from: inuse.at(inuse.length - 1) || "",
                            to: new_point_id,
                            id: v4(),
                            color: "white",
                            renderMode: "only-segment"
                        }])
                        set_inuse(prev => [...prev, new_point_id]);
                    }
                }
            } else if (placing == "eCenter" && event.button == 0) {
                if (inuse.length > 0 && event.button == 0 && Hovering_id) {
                    const id = v4();
                    var formula: string;
                    const p_from_index = points_data.findIndex(p => p.id == Hovering_id);
                    const c_from_index = points_calc_data.findIndex(p => p.id == Hovering_id);
                    const p_to_index = points_data.findIndex(p => p.id == inuse.at(inuse.length - 1));
                    const c_to_index = points_calc_data.findIndex(p => p.id == inuse.at(inuse.length - 1));
                    var fromTag, toTag;
                    fromTag = p_from_index > -1 ? points_data[p_from_index].tag : points_calc_data[c_from_index].tag;
                    toTag = p_to_index > -1 ? points_data[p_to_index].tag : points_calc_data[c_to_index].tag;
                    formula = `(${fromTag} + ${toTag})/2`;
                    if (Hovering_id != inuse.at(inuse.length - 1)) {
                        set_points_calc_data(prev => [...prev, {
                            formula: formula,
                            id: id,
                            tag: getUniqueTag(points_data, points_calc_data),
                            color: "white"
                        }])
                        set_inuse(prev => [...prev, id]);
                    }
                }
            } else if (placing == "ePerpendicular" && event.button == 0) {
                if (inuse.length > 0 && event.button == 0 && Hovering_id) {
                    const id = v4();
                    var formula: string;
                    const p_from_index = points_data.findIndex(p => p.id == Hovering_id);
                    const c_from_index = points_calc_data.findIndex(p => p.id == Hovering_id);
                    const p_to_index = points_data.findIndex(p => p.id == inuse.at(inuse.length - 1));
                    const c_to_index = points_calc_data.findIndex(p => p.id == inuse.at(inuse.length - 1));
                    var fromTag, toTag;
                    fromTag = p_from_index > -1 ? points_data[p_from_index].tag : points_calc_data[c_from_index].tag;
                    toTag = p_to_index > -1 ? points_data[p_to_index].tag : points_calc_data[c_to_index].tag;
                    const angle = Math.PI / 2;
                    formula = `
                    x: ${fromTag}.x + (${toTag}.x + (${fromTag}.x*-1)) * Math.cos(${angle}) - (${toTag}.y + (${fromTag}.y) * -1) * Math.sin(${angle})
                    y: ${fromTag}.y + (${toTag}.x + (${fromTag}.x*-1)) * Math.sin(${angle}) + (${toTag}.y + (${fromTag}.y) * -1) * Math.cos(${angle})`
                        ;
                    if (Hovering_id != inuse.at(inuse.length - 1)) {
                        set_points_calc_data(prev => [...prev, {
                            formula: formula,
                            id: id,
                            tag: getUniqueTag(points_data, points_calc_data),
                            visible: false,
                            color: "white"
                        }])
                        set_inuse(prev => [...prev, id]);
                        set_segmments_data(prev => [...prev, {
                            from: Hovering_id,
                            to: id,
                            id: v4(),
                            color: "white",
                            renderMode: "only-line",

                        }])
                    }
                }
            } else if (placing == "label" && event.button == 0) {
                var closest = 999999999;
                labels.forEach(label => {
                    const pos = toLocal({ x: label.left, y: label.top }, offset);
                    closest = Math.min(closest, Distance_Squared({ x: event.clientX, y: event.clientY }, { x: label.left, y: label.top }));
                })
                console.log(closest)
                if (closest > 100000) {
                    set_labels(prev => [...prev, {
                        left: offseted_mpos.x,
                        top: offseted_mpos.y,
                        content: "Double click to edit",
                        id: v4()
                    }])
                }
            } else if (placing == "graph" && event.button == 0) {
                set_graph(prev => [...prev, {
                    x: offseted_mpos.x,
                    y: offseted_mpos.y,
                    range_x: 1,
                    range_y: 1,
                    resolution: 30,
                    id: v4(),
                    functions: []
                }])
            } else if (placing == "anchor" && event.button == 0) {
                set_anchors(prev => [...prev, {
                    tag: "anchor",
                    order: 1,
                    id: v4(),
                    x: offseted_mpos.x,
                    y: offseted_mpos.y
                }])
            } else if (placing == "calc" && event.button == 0) {
                set_points_calc_data(prev => [...prev, {
                    formula: `(${Math.floor(offseted_mpos.x)},${Math.floor(offseted_mpos.y)})`,
                    tag: getUniqueTag(points_data, points_calc_data),
                    color: "#ffffff",
                    visible: true,
                    id: v4(),
                }])
            }
            if (isHovering && inuse.findIndex(id => id == Hovering_id) == -1 && event.button == 0) set_inuse(prev => [...prev, Hovering_id]);
            if (event.button == 2) set_inuse([]);

        }
        const mousemove = (event: MouseEvent) => {
            set_mpos({ 'x': event.clientX, 'y': event.clientY });
        }
        window.addEventListener("mousedown", mouseDown);
        window.addEventListener("mousemove", mousemove);
        return () => {
            window.removeEventListener("mousedown", mouseDown);
            window.removeEventListener("mousemove", mousemove);
        }
    }, [labels, set_graph, set_labels, points_data, inuse, mpos, size, accent, current_mode, offset, placing, points_calc_data, segments_data, set_points_calc_data, set_points_data, set_segmments_data, variables]);
    return (
        <>
            <canvas
                ref={canvas_ref}
                style={{
                    width: '100%',
                    height: '100%',
                    position: "fixed"
                }}
            />
            <motion.p style={{
                position: 'fixed',
                width: '100%',
                fontFamily: "Poppins",
                textAlign: 'center',
                top: "100%",
                zIndex: 10
            }}
                animate={{
                    top: current_mode == "euclidian" ? "95%" : "100%",
                }}
            >{placing != null ? tips[placing] : "Select any element from the gallery"}
            </motion.p>
            <motion.div
                className={style.EuclidianGallery}
                ref={gallery_ref}
                style={{
                    left: current_mode == "euclidian" ? "calc(70% - 1rem)" : "100%",
                    border: `2px solid ${accent}`,

                }}

            >
                <h1 className={style.Title1} style={{ color: accent }} >GALLERY</h1>
                <br />
                <br />
                <motion.div
                    style={{
                        width: "100%",
                        flexDirection: 'row',
                        display: 'flex',
                        alignContent: "center",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: "9rem",
                        alignItems: 'center'
                    }}
                >

                    {...essentials.map(type =>
                        <motion.div
                            className={style.Card}
                            key={type}
                            style={{
                                boxShadow: placing == type ? `0 0 10px 2px ${accent}` : "",
                            }}
                            whileHover={{
                                scale: 1.1
                            }}
                            whileTap={{
                                scale: 0.9
                            }}
                            onTap={() => {
                                setPlacing(type as any);
                            }}
                        >
                            <div style={{ scale: 0.5 }}>
                                {type == "ePoint" ?
                                    <div>
                                        <h1 style={{
                                            position: "fixed",
                                            color: "black",
                                            fontSize: `calc(3.2rem)`,
                                            lineHeight: '147%',
                                            fontFamily: "Poppins",
                                            fontWeight: "bold",
                                            textAlign: "center",
                                            width: "100%",
                                            height: "100%",
                                            userSelect: "none"
                                        }} >A</h1>
                                        <svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="-1.5 -2 3 3">
                                            <path d="M 0 -2 A 1 1 0 0 0 0 1 A 1 1 0 0 0 0 -2 M 0 -2" />
                                        </svg>
                                    </div> : null}
                                {type == "eSegment" ? <svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" id="Flat">
                                    <path d="M214.62793,86.62695a32.0716,32.0716,0,0,1-38.88245,4.94141L91.56836,175.74561a32.00172,32.00172,0,1,1-50.19629-6.37256l.00049-.001a32.05731,32.05731,0,0,1,38.88208-4.94043l84.177-84.17725a32.00172,32.00172,0,1,1,50.19629,6.37256Z" />
                                </svg> : null}
                                {type == "graph" ? <svg fill="#ffffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 27.32 27.32"
                                >
                                    <g>
                                        <g>
                                            <path d="M1.29,25.669V25.64l4.825-9.713c0.116,0.032,0.237,0.058,0.364,0.058c0.193,0,0.375-0.045,0.54-0.118l4.248,4.521
			c-0.13,0.203-0.208,0.443-0.208,0.705c0,0.725,0.588,1.312,1.313,1.312s1.313-0.589,1.313-1.312c0-0.403-0.185-0.759-0.47-1
			l2.58-5.314h0.462v-0.16h-0.384l2.264-4.664c0.086,0.018,0.174,0.026,0.266,0.026c0.26,0,0.5-0.076,0.703-0.206l4.549,4.29
			c-0.105,0.188-0.17,0.401-0.17,0.634c0,0.725,0.588,1.312,1.312,1.312s1.312-0.588,1.312-1.312c0-0.725-0.588-1.313-1.312-1.313
			c-0.259,0-0.499,0.077-0.701,0.206l-4.55-4.289c0.104-0.189,0.169-0.402,0.169-0.633c0-0.727-0.587-1.315-1.312-1.315
			c-0.698,0-1.264,0.547-1.305,1.233h-0.021v0.161h0.021c0.021,0.368,0.195,0.694,0.461,0.919l-4.921,10.141
			c-0.085-0.019-0.175-0.027-0.266-0.027c-0.23,0-0.444,0.064-0.632,0.169L7.523,15.46c0.146-0.191,0.237-0.426,0.258-0.682h0.544
			v-0.16H7.787c-0.03-0.701-0.601-1.26-1.308-1.26c-0.708,0-1.279,0.559-1.308,1.26h-0.15v0.16h0.156
			c0.027,0.322,0.163,0.611,0.378,0.825l-2.687,5.407H2.377v0.162h0.411L1.29,24.189V0.364H0v26.592h27.32v-1.287H1.29z"/>
                                            <rect x="26.168" y="2.581" width="0.323" height="0.16" />
                                            <rect x="18.238" y="2.581" width="0.66" height="0.16" />
                                            <rect x="3.699" y="2.581" width="0.661" height="0.16" />
                                            <rect x="19.561" y="2.581" width="0.66" height="0.16" />
                                            <rect x="5.021" y="2.581" width="0.661" height="0.16" />
                                            <rect x="14.273" y="2.581" width="0.66" height="0.16" />
                                            <rect x="12.951" y="2.581" width="0.661" height="0.16" />
                                            <rect x="16.916" y="2.581" width="0.661" height="0.16" />
                                            <rect x="15.596" y="2.581" width="0.66" height="0.16" />
                                            <rect x="2.376" y="2.581" width="0.662" height="0.16" />
                                            <rect x="8.985" y="2.581" width="0.661" height="0.16" />
                                            <rect x="24.846" y="2.581" width="0.661" height="0.16" />
                                            <rect x="20.881" y="2.581" width="0.661" height="0.16" />
                                            <rect x="11.628" y="2.581" width="0.662" height="0.16" />
                                            <rect x="10.308" y="2.581" width="0.661" height="0.16" />
                                            <rect x="22.203" y="2.581" width="0.66" height="0.16" />
                                            <rect x="6.343" y="2.581" width="0.66" height="0.16" />
                                            <rect x="23.525" y="2.581" width="0.66" height="0.16" />
                                            <rect x="7.664" y="2.581" width="0.661" height="0.16" />
                                            <rect x="1.394" y="2.581" width="0.323" height="0.16" />
                                            <rect x="26.327" y="8.587" width="0.321" height="0.161" />
                                            <rect x="23.684" y="8.587" width="0.662" height="0.161" />
                                            <rect x="22.361" y="8.587" width="0.66" height="0.161" />
                                            <rect x="7.823" y="8.587" width="0.661" height="0.161" />
                                            <rect x="6.501" y="8.587" width="0.661" height="0.161" />
                                            <rect x="10.466" y="8.587" width="0.66" height="0.161" />
                                            <rect x="21.04" y="8.587" width="0.662" height="0.161" />
                                            <rect x="11.787" y="8.587" width="0.662" height="0.161" />
                                            <rect x="25.005" y="8.587" width="0.661" height="0.161" />
                                            <rect x="9.144" y="8.587" width="0.661" height="0.161" />
                                            <rect x="15.752" y="8.587" width="0.661" height="0.161" />
                                            <rect x="2.535" y="8.587" width="0.662" height="0.161" />
                                            <rect x="14.432" y="8.587" width="0.661" height="0.161" />
                                            <rect x="13.11" y="8.587" width="0.661" height="0.161" />
                                            <rect x="3.857" y="8.587" width="0.661" height="0.161" />
                                            <rect x="19.718" y="8.587" width="0.661" height="0.161" />
                                            <rect x="5.179" y="8.587" width="0.661" height="0.161" />
                                            <rect x="1.552" y="8.587" width="0.322" height="0.161" />
                                            <rect x="26.168" y="14.617" width="0.323" height="0.16" />
                                            <rect x="11.628" y="14.617" width="0.662" height="0.16" />
                                            <rect x="12.951" y="14.617" width="0.661" height="0.16" />
                                            <rect x="14.273" y="14.617" width="0.66" height="0.16" />
                                            <rect x="18.238" y="14.617" width="0.66" height="0.16" />
                                            <rect x="22.203" y="14.617" width="0.66" height="0.16" />
                                            <rect x="19.561" y="14.617" width="0.66" height="0.16" />
                                            <rect x="10.308" y="14.617" width="0.661" height="0.16" />
                                            <rect x="16.916" y="14.617" width="0.661" height="0.16" />
                                            <rect x="20.881" y="14.617" width="0.661" height="0.16" />
                                            <rect x="2.376" y="14.617" width="0.662" height="0.16" />
                                            <rect x="3.699" y="14.617" width="0.661" height="0.16" />
                                            <rect x="8.985" y="14.617" width="0.661" height="0.16" />
                                            <rect x="1.394" y="14.617" width="0.323" height="0.16" />
                                            <rect x="26.168" y="21.011" width="0.323" height="0.162" />
                                            <rect x="3.699" y="21.011" width="0.661" height="0.162" />
                                            <rect x="14.273" y="21.011" width="0.66" height="0.162" />
                                            <rect x="10.308" y="21.011" width="0.661" height="0.162" />
                                            <rect x="5.021" y="21.011" width="0.661" height="0.162" />
                                            <rect x="6.343" y="21.011" width="0.661" height="0.162" />
                                            <rect x="7.665" y="21.011" width="0.661" height="0.162" />
                                            <rect x="15.596" y="21.011" width="0.66" height="0.162" />
                                            <rect x="8.986" y="21.011" width="0.661" height="0.162" />
                                            <rect x="22.204" y="21.011" width="0.659" height="0.162" />
                                            <rect x="23.525" y="21.011" width="0.66" height="0.162" />
                                            <rect x="24.848" y="21.011" width="0.66" height="0.162" />
                                            <rect x="19.561" y="21.011" width="0.662" height="0.162" />
                                            <rect x="18.238" y="21.011" width="0.66" height="0.162" />
                                            <rect x="20.882" y="21.011" width="0.661" height="0.162" />
                                            <rect x="16.917" y="21.011" width="0.662" height="0.162" />
                                            <rect x="1.394" y="21.011" width="0.323" height="0.162" />
                                        </g>
                                    </g>
                                </svg> : null}
                                {type == "anchor" ?
                                    <svg style={{
                                        position: "fixed",
                                        marginTop: '2.4rem'
                                    }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                                        <g id="SVGRepo_bgCarrier" stroke-width="0" />
                                        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" />
                                        <g id="SVGRepo_iconCarrier">
                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M13 6.82929C14.1652 6.41746 15 5.30622 15 4C15 2.34315 13.6568 1 12 1C10.3431 1 8.99999 2.34315 8.99999 4C8.99999 5.30622 9.8348 6.41746 11 6.82929V9H9.99999C9.44771 9 8.99999 9.44771 8.99999 10C8.99999 10.5523 9.44771 11 9.99999 11H11V20.9513C9.6854 20.8184 8.69059 20.4252 7.92969 19.9179C6.98043 19.2851 6.33511 18.4342 5.89442 17.5528C5.45178 16.6675 5.22547 15.7701 5.11139 15.0856C5.10656 15.0566 5.10194 15.0281 5.09752 15H5.99999C6.55228 15 6.99999 14.5523 6.99999 14C6.99999 13.4477 6.55228 13 5.99999 13H3.99999C3.37285 13 2.98297 13.5373 3.0025 14.1232C3.00953 14.3341 3.03602 14.7989 3.1386 15.4144C3.27451 16.2299 3.54821 17.3325 4.10557 18.4472C4.66488 19.5658 5.51956 20.7149 6.82029 21.5821C8.12729 22.4534 9.82501 23 12 23C14.175 23 15.8727 22.4534 17.1797 21.5821C18.4804 20.7149 19.3351 19.5658 19.8944 18.4472C20.4518 17.3325 20.7255 16.2299 20.8614 15.4144C20.964 14.7989 20.9905 14.3341 20.9975 14.1232C21.017 13.5373 20.6272 13 20 13H18C17.4477 13 17 13.4477 17 14C17 14.5523 17.4477 15 18 15H18.9025C18.898 15.0281 18.8934 15.0566 18.8886 15.0856C18.7745 15.7701 18.5482 16.6675 18.1056 17.5528C17.6649 18.4342 17.0196 19.2851 16.0703 19.9179C15.3094 20.4252 14.3146 20.8184 13 20.9513V11H14C14.5523 11 15 10.5523 15 10C15 9.44771 14.5523 9 14 9H13V6.82929ZM12 5.04921C11.4205 5.04921 10.9508 4.57946 10.9508 4C10.9508 3.42054 11.4205 2.95079 12 2.95079C12.5795 2.95079 13.0492 3.42054 13.0492 4C13.0492 4.57946 12.5795 5.04921 12 5.04921Z" />
                                        </g>
                                    </svg> : null}
                                {type == "label" ? <svg fill="white" xmlns="http://www.w3.rg/2000/svg"
                                    viewBox="0 0 32 32">
                                    <g>
                                        <path d="M27,22.1V9.9c1.7-0.4,3-2,3-3.9c0-2.2-1.8-4-4-4c-1.9,0-3.4,1.3-3.9,3H9.9C9.4,3.3,7.9,2,6,2C3.8,2,2,3.8,2,6
		c0,1.9,1.3,3.4,3,3.9v12.3c-1.7,0.4-3,2-3,3.9c0,2.2,1.8,4,4,4c1.9,0,3.4-1.3,3.9-3h12.3c0.4,1.7,2,3,3.9,3c2.2,0,4-1.8,4-4
		C30,24.1,28.7,22.6,27,22.1z M22.1,25H9.9c-0.4-1.4-1.5-2.5-2.9-2.9V9.9C8.4,9.5,9.5,8.4,9.9,7h12.3c0.4,1.4,1.5,2.5,2.9,2.9v12.3
		C23.6,22.5,22.5,23.6,22.1,25z"/>
                                        <path d="M21,10H11c-0.6,0-1,0.4-1,1v2c0,0.6,0.4,1,1,1s1-0.4,1-1v-1h3v8h-1c-0.6,0-1,0.4-1,1s0.4,1,1,1h4c0.6,0,1-0.4,1-1
		s-0.4-1-1-1h-1v-8h3v1c0,0.6,0.4,1,1,1s1-0.4,1-1v-2C22,10.4,21.6,10,21,10z"/>
                                    </g>
                                </svg> : null}
                                {type == "calc" ? <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(1, 0, 0, 1, 0, 0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M40 9L37 6H8L26 24L8 42H37L40 39" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg> : null}
                            </div>
                        </motion.div>)}

                </motion.div>
            </motion.div>
        </>)
}