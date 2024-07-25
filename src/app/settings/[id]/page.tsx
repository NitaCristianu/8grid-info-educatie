"use client";
import GradientCircle from "@/app/components/GradientCircle";
import prisma from "@/app/libs/prisma";
import { CSSProperties, useEffect, useState } from "react";
import SettingsClient from "./components/settings-client";
import { redirect } from "next/navigation";
import ExitButton from "@/app/login/components/upperTab";
import { originalData } from "@/app/explorer/[id]/components/explorer-client-post";


export default function (props: { params: { id: string } }) {
    const post_id = props.params.id;
    const [post, setPost] = useState<originalData | null>(null);
    const color = post?.type == "Math" ? "rgb(30, 106, 247)" : "rgb(239, 94, 41)";

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        fetch('/api/post', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
        })
            .then((response) => response.json())
            .then((d?: originalData[]) => {
                setPost(d?.find(post => post.id == post_id) || null);
            })
            .catch((error) => console.log('error', error));
        setIsClient(true);
    }, []);
    if (!isClient) {
        return null;
    }

    function saveSettings(props: {
        title: string,
        description: string,
        public: boolean,
        deleted: boolean,
    }) {
        if (!post) return;
        fetch('/api/post', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                id: post_id,
                userId: localStorage.getItem("userId"),
                type: post?.type,
                title: props.title,
                description: props.description,
                public: props.public,
                update: true,
                delete: false
            }),
        }).catch((error) => console.log('error', error));
        if (props.deleted)
            redirect("/");
        else
            redirect(`/explorer/${post_id}`);


    };

    if (!post) return;
    return <div
        suppressHydrationWarning
    >
        <GradientCircle
            x={-0.54}
            y={-1.4}
            color={"rgba(117, 232, 180, 0.48)"}
            opacity={0.4}
            size={1.4}
        />
        <GradientCircle
            x={0.14}
            y={-1.0}
            color={"rgba(178, 216, 64, 0.48)"}
            opacity={0.4}
            size={1.4}
        />
        <GradientCircle
            x={0.14}
            y={-0.1}
            color={"rgba(64, 216, 79, 0.48)"}
            opacity={0.4}
            size={1.4}
        />
        <GradientCircle
            x={-0.34}
            y={-0.5}
            color={"rgba(117, 230, 232, 0.48)"}
            opacity={0.4}
            size={1}
        />
        <GradientCircle
            x={-0.34}
            y={-0.1}
            color={"rgba(203, 117, 232, 0.48)"}
            opacity={0.4}
            size={1}
        />
        <GradientCircle
            x={-0.34}
            y={-1.2}
            color={color}
            opacity={.6}
            size={1.8}
        />
        <SettingsClient savePost={saveSettings} post={post} redirect={((href: string) => { redirect(href) })} />
        <ExitButton />
    </div >
}