import prisma from "@/app/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId, postId } = await req.json();

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
            likes: [...post.likes, userId]
        }
    })

    return NextResponse.json({ message: "uploaded data success" });
}