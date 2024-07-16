import GradientCircle from "@/app/components/GradientCircle";
import prisma from "@/app/libs/prisma";
import { CSSProperties } from "react";
import SettingsClient from "./components/settings-client";
import { redirect } from "next/navigation";
import ExitButton from "@/app/login/components/upperTab";


export default async function (props: { params: { id: string } }) {
    const post_id = props.params.id;
    const post = await prisma.post.findUnique({ where: { id: post_id } });
    const color = post?.type == "Math" ? "rgb(30, 106, 247)" : "rgb(239, 94, 41)";

    async function saveSettings(props: {
        title: string,
        description: string,
        public: boolean,
        deleted: boolean,
    }) {
        "use server";
        if (props.deleted) {
            await prisma.post.delete({ where: { id: post_id } });
            redirect("/");
        } else {
            await prisma.post.update({
                where: { id: post_id },
                data: {
                    title: props.title,
                    Description: props.description,
                    Public: props.public
                }
            });
            redirect(`/explorer/${post_id}`);
        }

    };

    if (!post) return;
    return <div>
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
        <SettingsClient savePost={saveSettings} post={post} redirect={(async (href: string) => { "use server"; redirect(href) })} />
        <ExitButton exit={async () => { "use server"; redirect("/"); }} />
    </div>
}