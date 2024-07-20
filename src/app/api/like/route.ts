import prisma from "@/app/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId, postId } = await req.json();

    await prisma.post.update({
        where: {
            id: postId
        },
        data: {
            likes: {
                push: userId
            },
        }
    })

    return NextResponse.json({ message: "uploaded data success" });
}