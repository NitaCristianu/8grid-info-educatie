"use client";
import prisma from "@/app/libs/prisma";
import ExplorerClient from "./components/explorer-client-post";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Explorer(props: { params: { id: string } }) {
    // the page for explorer [id]
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }
    // only render client - wise
    return <div
        suppressHydrationWarning
    ><ExplorerClient
            postId={props.params.id}

        /></div>
}