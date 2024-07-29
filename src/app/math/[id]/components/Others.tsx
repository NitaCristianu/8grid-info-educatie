"use client"
import { ePoint, ePoints_Calc, eSegment, Label, WorldParams, anchor } from '../data/props';
import { useAtom } from "jotai";
import { ePoints_Calc_data, ePoints_data, eSegments_data, GRAPHS, labels_data } from "../data/elements";
import { memo, useEffect } from 'react';
import { ANCHORS, AUTHOR, WORLD_ID, WORLD_NAME } from "../data/globals";

/*
USED FOR LOADING DATA FROM DB INTO THE POST

*/

const Others = memo((props: any) => {
    const [_, set_points] = useAtom(ePoints_data);
    const [__, set_points_calc] = useAtom(ePoints_Calc_data);
    const [___, set_segments] = useAtom(eSegments_data);
    const [____, set_labels] = useAtom(labels_data);
    const [_____, set_name] = useAtom(WORLD_NAME);
    const [______, set_id] = useAtom(WORLD_ID);
    const [_______, set_author] = useAtom(AUTHOR);
    const [_________, set_anchors] = useAtom(ANCHORS);
    const [________, set_graph] = useAtom(GRAPHS);


    useEffect(() => {
        set_name(props.name);
        set_id(props.id);
        set_author(props.author || []);
        if (props.graphs)
            set_graph(((props.graphs as any[]).map(graph => ({ ...graph, functions: (graph.functions) })) as any) || []);
        set_points(props.points || []);
        set_points_calc(props.points_calc || []);
        set_segments(props.segments || []);
        set_labels(props.labels || []);
        set_anchors(props.anchors || []);
    }, [props]);

    return (<div></div>);
});
Others.displayName = 'editor-others'
export default Others;