"use client";
import Euclidian from "./components/main/Geometry/Euclidian";
import Grid from "./components/main/Grid/Grid";
import Taskbar from "./components/main/Taskbar/Taskbar";
import EuclidianGallery from "./components/main/Tabs/EuclidianGallery";
import Actions from "./components/main/Tabs/Actions";
import Text from "./components/main/Text/Text";
import Menu from "./components/main/Tabs/Menu";
import GraphGallery from "./components/main/Tabs/GraphGallery";
import Graphs from "./components/main/Geometry/Graphs";
import Others from "./components/Others";
import AchorsTab from "./components/main/Tabs/AnchorsTab";
import Anchors from "./components/main/Geometry/Anchors";
import { useEffect, useState } from "react";
import { originalData } from "@/app/explorer/[id]/components/explorer-client-post";
import ExitButton from "@/app/login/components/upperTab";

export interface WorldData {
    anchors: any[],
    graphs: any[],
    points: any[],
    points_calcs: any[],
    segments: any[],
    labels: any[]
};

export default function Home(props: { params: { id: string } }) {

    const id = props.params.id.slice(1, props.params.id.length);
    const isEditable = props.params.id[0] == '1';
    const [post, setPost] = useState<originalData | null>(null);
    const [isClient, setIsClient] = useState(false);
    const [content_Data, setContent] = useState<WorldData>({
        anchors: [],
        graphs: [],
        points: [],
        points_calcs: [],
        segments: [],
        labels: []
    });

    useEffect(() => {
        fetch('/api/post', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
        })
            .then((response) => response.json())
            .then((d) => {
                const post = (d as originalData[]).find(post => post.id == id) || null;
                setPost(post);
                if (post) {
                    const content = post?.content.length > 0 ? post.content : "{}";
                    setContent(JSON.parse(content));
                }

            })
            .catch((error) => console.log('error', error));
        setIsClient(true);
    }, [])

    if (!isClient) {
        return null;
    }

    return (<>
        <Others
            author={post?.userId}
            name={post?.title}
            id={id}
            {...content_Data}
        />
        <Grid />
        <Euclidian />
        <Anchors />
        <Text isEditable />
        <Graphs isEditable = {isEditable} />
        <ExitButton />
        {isEditable ? <Taskbar id={id} /> : null}
        <EuclidianGallery />
        {isEditable ? <GraphGallery /> : null}
        <Menu />
        <AchorsTab />
        {isEditable ? <Actions /> : null}
    </>)
}