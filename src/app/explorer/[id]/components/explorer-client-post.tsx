"use client";
import { user_type } from "@/app/variables";
import { useEffect, useState } from "react";
import Projectbutton from "./project-button";
import Description from "./description";
import Comments from "./comments";
import ExitButton from "@/app/login/components/upperTab";
import { redirect } from "next/navigation";

export interface originalData {
    id: string;
    userId: string | null;
    title: string;
    content: string;
    type: string;
    likes: string[];
    Comments: string[];
    Description: string;
    Public: boolean;
}

export default function ExplorerClient(props: {
    postId: string
}) {
    // obtain post data
    const [post_data, setPostData] = useState<originalData | null>(null);
    const [user_data, setUserData] = useState<user_type | null>(null);
    const [action, setAction] = useState(false);

    useEffect(() => {
        fetch('/api/post', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
        })
            .then((response) => response.json())
            .then((d) => {
                const post = (d as originalData[]).find(post => post.id == props.postId);
                setPostData(post || null);
            })
            .catch((error) => console.log('error', error));
        fetch('/api/user', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
        })
            .then((response) => response.json())
            .then((d) => {
                const userId = typeof (window) != "undefined" ? localStorage.getItem("userId") : null;
                setUserData((d as user_type[]).find(user => user.id == userId) || null);
            })
            .catch((error) => console.log('error', error));

    }, [action, props.postId])

    return <div
        style={{
            padding: "2rem",
            display: 'flex',
            flexDirection: 'row',
            width: '100vw',
            height: '100vh',
            background: post_data?.type == "Math" ? "rgb(0, 19, 52)" : "rgb(19, 9, 1)",
            gap: '2rem'
        }}
    >
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                height: 'calc(100vh - 2rem)',
                marginTop: '6vh',
                width: '55vw',
            }}
        >
            <Projectbutton
                post_data={post_data}
            />
            <Description
                post_data={post_data}
                user_data={user_data || null}
            />

        </div>
        <Comments post_data={post_data} />
        <ExitButton />
    </div>
}