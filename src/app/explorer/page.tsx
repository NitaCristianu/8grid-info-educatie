import { redirect } from "next/navigation";
import prisma from "../libs/prisma"
import ExitButton from "../login/components/upperTab";
import ExplorerClient from "./components/explorer-client";

export default async function Explorer() {
    const posts = await prisma.post.findMany();

    return <div>
        <ExplorerClient
            posts={posts}
            redirect={async (href: string) => { "use server"; redirect(href) }}
        />
        <ExitButton
            exit={async () => { "use server"; redirect('/') }}
        />
    </div>
}