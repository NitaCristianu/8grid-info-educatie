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

export default async function Home(props: { params: { id: string } }) {
    const id = props.params.id.slice(1, props.params.id.length);
    const isEditable = props.params.id[0] == '1';

    const post = await prisma.post.findUnique({ where: { id: id } });
    const post_data_string = (post?.content && post.content.length > 0) ? post.content : "{}";
    if (!post_data_string) return;

    const content: Sim_data = JSON.parse(post_data_string);
    return <>
        {!isEditable ? <ExitButton
            exit={async () => {
                'use server'; redirect("/explorer/" + id)
            }}
        /> : <ExitButton
            exit={async () => {
                'use server'; redirect("/explorer/" + id)
            }}
        />}
        <Grid
            isEditable={isEditable}
            data={content}
        />
        {isEditable ? <Taskbar
            saveproject={async (data: Sim_data) => {
                "use server";
                console.log(data);
                if (post) {
                    console.log(post.id, content);
                    await prisma.post.update({ where: { id: post.id }, data: { content: JSON.stringify(data) } })
                }
                else
                    console.log("post not found!");
                redirect("/explorer/" + id);

            }}
        /> : null}
        {isEditable ? <Properties /> : null}
        <CipMenu />
    </>
}