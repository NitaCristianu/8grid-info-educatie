"use client";
import prisma from "@/app/libs/prisma";
import CipMenu from "./components/CipMenu";
import Properties from "./components/propertiestab";
import Taskbar from "./components/taskbar";
import Grid from "./components/grid";
import ExitButton from "@/app/login/components/upperTab";
import { redirect } from "next/navigation";
import { Inputs, Connections, Outputs, Prefabs, Cips } from "./data/elements";
import Pin from "./class/Pin";
import And from "./class/And";
import Cip from "./class/Cip";
import Connection, { ConnectionEnd, ConnectionStart } from "./class/Connection";
import { useEffect, useState } from "react";
import { originalData } from "@/app/explorer/[id]/components/explorer-client-post";

export interface Sim_data {
    inputs: {
        y: number;
        name: string;
        id: string;
    }[];
    outputs: {
        y: number;
        name: string;
        id: string;
    }[];
    prefabs: {
        inputsNum: number;
        name: string;
        outputFormulas: string[];
        desc? : string,
        color: string;
    }[];
    cips: {
        x: number;
        y: number;
        id: string;
        name: string;
    }[];
    connections: {
        start: ConnectionStart,
        end: ConnectionEnd,
    }[]
}

export default function Home(props: { params: { id: string } }) {

    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);


    const id = props.params.id.slice(1, props.params.id.length);
    const isEditable = props.params.id[0] == '1';
    const [post, setPost] = useState<originalData | null>(null);
    const [content, setContent] = useState<Sim_data | null>(null);
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
    }, []);
    if (!isClient) {
        return null;
    }

    return <>
        <ExitButton
            href={"/explorer/" + id}
        />
        <Grid
            isEditable={isEditable}
            data={content}
        />
        {isEditable ? <Taskbar
            saveproject={(data: Sim_data) => {
                if (post) {
                    fetch('/api/post', {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            id: id,
                            userId: localStorage.getItem("userId"),
                            type: post.type,
                            title: post.title,
                            description: post.Description,
                            public: post.Public,
                            update: true,
                            delete: false,
                            content: JSON.stringify(data)
                        }),
                    }).catch((error) => console.log('error', error));
                }
                else
                    console.log("post not found!");

            }}
        /> : null}
        {isEditable ? <Properties /> : null}
        <CipMenu />
    </>
}