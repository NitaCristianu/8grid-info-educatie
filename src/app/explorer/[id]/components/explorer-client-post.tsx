"use client";
import { currentUser_atom, post_type, user_type } from "@/app/variables";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Projectbutton from "./project-button";
import Description from "./description";
import { useAtom } from "jotai";
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
    requestPostData: (postId?: string) => Promise<originalData | null>,
    like: (postId: string, userId: string) => Promise<void>,
    postComment: (userId: string, content: string) => Promise<void>,
    goHome: () => void,
    redirect: (href: string) => Promise<void>,
    post_data: originalData | null,
    users_data: user_type[] | null,
}) {
    // obtain post data
    const [post_data, setPostData] = useState<originalData | null>(props.post_data);
    const userId = typeof (window) != "undefined" ? localStorage.getItem("userId") : null;
    const user_data = props.users_data?.find(user => user.id == userId);

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
                redirect={props.redirect}
                post_data={post_data}
            />
            <Description
                post_data={post_data}
                user_data={user_data || null}
                like={props.like}
            />

        </div>
        <Comments
            post_data={post_data}
            postComment={props.postComment}
            users={props.users_data || null}
        />
        <ExitButton
            exit={props.goHome}
        />
    </div>
}