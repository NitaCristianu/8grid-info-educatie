import prisma from "@/app/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId, postId } = await req.json();
        if (!userId || !postId) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const post = await prisma.post.findUnique({
            where: { id: postId }
        });
        await prisma.post.updateMany({
            where: { id: postId },
            data: { likes: [...(post?.likes || []), userId] }
        })

        return NextResponse.json({ message: "Success" });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
