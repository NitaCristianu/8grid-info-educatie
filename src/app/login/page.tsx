"use client"
import { PrismaClient } from "@prisma/client/extension"
import prisma from "../libs/prisma"
import LogInSignInComponent from "./components/login-sigin";
import ExitButton from "./components/upperTab";
import { redirect } from "next/navigation";
import GradientCircle from "../components/GradientCircle";
import { useEffect, useState } from "react";
import Background3 from "./components/Background3";

export default function Page() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) {
        return null;
    }
    return <div
        suppressHydrationWarning
    >
        {/* <GradientBackground
            color1={{ r: 37, g: 40, b: 65 }}
            color2={{ r: 108, g: 189, b: 151 }}
        /> */}
        <Background3

        />
        <LogInSignInComponent
            logIn={(id: string) => redirect(`/account/${id}`)}
        />
        <ExitButton />
        {/* 
        <GradientCircle
            size={1.1}
            x={0}
            y={-0.55}
            color="rgba(231, 83, 83, 0.32)"
        />
        <GradientCircle
            size={0.9}
            x={-.1}
            y={0.1}
            color="rgba(70, 39, 191, 0.22)"
        />
        <GradientCircle
            size={0.9}
            x={0.2}
            y={0.1}
            color="rgba(107, 191, 39, 0.22)"
        /> */}
    </div>
}