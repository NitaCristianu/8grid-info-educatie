import prisma from "@/app/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId, content, postId } = await req.json();

    const commentData = JSON.stringify({ user: userId, comment: content });

    await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            Comments: {
                push: commentData
            },
        }
    })

    return NextResponse.json({ message: "uploaded data success" });
}