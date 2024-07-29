import { NextResponse } from "next/server";
import prisma from "@/app/libs/prisma";

export async function GET(req: Request) {
    // obtaining post data
    const posts = await prisma.post.findMany();
    const data = JSON.stringify(posts);
    return new Response(data);
}

export async function POST(req: Request) {
    // creating, updating, deleting post
    const data: {
        title: string,
        type: string,
        userId?: string,
        id?: string,
        description?: string,
        content?: string,
        public?: boolean,
        update?: boolean,
        delete?: boolean,

    } = await req.json();

    if (data.delete == true) {
        // deleted
        await prisma.post.delete({
            where: { id: data.id }
        })
        return NextResponse.json({ message: "uploaded data success" });
    }
    if (data.update) {
        // update post
        const post_data = await prisma.post.findFirst({ where: { id: data.id } });
        if (post_data)
            await prisma.post.update({
                where: { id: data.id },
                data: {
                    Public: data.public != undefined ? data.public : post_data.Public,
                    title: data.title || post_data.title,
                    Description: data.description || data.description,
                    content: data.content || data.content
                }
            })
        return NextResponse.json({ message: "uploaded data success" });
    }

    // create post
    await prisma.post.create({
        data: {
            title: data.title,
            type: data.type,
            Comments: [],
            likes: [],
            content: "",
            userId: data.userId,
            Description: "Default description",
        }
    })

    return NextResponse.json({ message: "uploaded data success" });
}