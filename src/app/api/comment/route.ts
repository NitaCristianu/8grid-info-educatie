import prisma from "@/app/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId, content, postId } = await req.json();

    const commentData = JSON.stringify({ user: userId, comment: content });

    const post = await prisma.post.findUnique({
        where: { id: postId }
    });

    if (!post) {
        return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            Comments: [...post.Comments, commentData]
        }
    })

    return NextResponse.json({ message: "uploaded data success" });
}