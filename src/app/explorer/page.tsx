"use client";
import { redirect } from "next/navigation";
import prisma from "../libs/prisma"
import ExitButton from "../login/components/upperTab";
import ExplorerClient from "./components/explorer-client";
import { useEffect, useState } from "react";

export default function Explorer() {
    const [isClient, setIsClient] = useState(false);
    // the page for explorer client
    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }
    // only use clinet wise
    return <div
        suppressHydrationWarning // make sure unnecesarry bugs are solved.
    >
        <ExplorerClient/>
        <ExitButton/>
    </div>
}