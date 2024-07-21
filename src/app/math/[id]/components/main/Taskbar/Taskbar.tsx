"use client"
import { ACCENT, ANCHORS, BACKGROUND, mode, MODE } from "@/app/math/[id]/data/globals";
import styles from "./styles.module.css";
import selection_icon from './icons/selection.svg';
import { motion } from "framer-motion";
import { useAtom } from "jotai";
import { modify } from "@/app/math/[id]/data/management";
import Image from "next/image";
import SelectionIcon from "./assets/SelectionIcon.png";
import MenuIcon from "./assets/MenuIcon2.png";
import EuclidianGallery from "./assets/GeometryGallery.png";
import TextIc from "./assets/Text.png";
import saveIcon from './assets/saveIcon.png';
import Graph from "./assets/Graph2.png";
import { ePoints_Calc_data, ePoints_data, eSegments_data, GRAPHS, labels_data } from "../../../data/elements";

const buttons: mode[] = [
    "menu",
    "selection",
    "euclidian",
    "graph"
]

export default function Taskbar(props: { id: string }) {
    const [current_mode, set_mode] = useAtom(MODE);
    const id = props.id;
    const bgr = useAtom(BACKGROUND)[0];
    const acc = useAtom(ACCENT)[0];
    const [points] = useAtom(ePoints_data);
    const [segments] = useAtom(eSegments_data);
    const [points_calc] = useAtom(ePoints_Calc_data);
    const [labels] = useAtom(labels_data);
    const [graphs] = useAtom(GRAPHS);
    const [anchors] = useAtom(ANCHORS);

    return (<div
        className={styles.taskbar}
        style={{
            justifyContent: 'center',
            alignItems: 'center'
        }}
    >
        {...buttons.map(type =>
        (<motion.div
            key={type}
            className={styles.button}
            animate={{
                marginRight: current_mode == type ? 0 : 20,
            }}
            whileHover={{
                marginRight: current_mode != type ? 20 : 5,
                scale: 1.1
            }}
            whileTap={{
                scale: 0.9
            }}
            onTap={() => {
                if (type == "menu") {
                    const data = {
                        points,
                        segments,
                        points_calc,
                        labels,
                        graphs: (graphs as any[]).map(g => ({
                            x: g.x,
                            y: g.y,
                            id: g.id,
                            functions: g.functions,
                            range_x: g.range_x,
                            range_y: g.range_y,
                            resolution: g.resolution
                        })),
                        anchors,
                    }
                    fetch('/api/post', {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            id: id,
                            update: true,
                            content: JSON.stringify(data)
                        }),
                    }).catch((error) => console.log('error', error));
                } else
                    set_mode(type);
            }}
        >
            {type == "menu" ? <Image src={saveIcon} alt="save Icon" /> : null}
            {type == "selection" ? <Image src={SelectionIcon} alt="selection icon" /> : null}
            {type == "euclidian" ? <Image src={EuclidianGallery} alt="euclidian gallery icon" /> : null}
            {type == "graph" ? <Image src={Graph} alt="graph icon" /> : null}
            <motion.p
                style={{
                    fontWeight: 800,
                    fontFamily: "Poppins",
                    color: 'white',
                }}
                animate={{
                    opacity: current_mode == type ? 1 : 0,
                    scale: current_mode == type ? 1 : 0.8,
                    marginLeft: current_mode == type ? '5%' : 0,
                    marginTop: current_mode == type ? '5%' : 0,

                }}
            >{(type == "euclidian" ? "BUILD" : type.toUpperCase()) + " MODE"}</motion.p>
        </motion.div>))}



    </div>)
}