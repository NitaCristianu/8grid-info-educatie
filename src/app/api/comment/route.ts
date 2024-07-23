import prisma from "@/app/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId, content, postId } = await req.json();
        if (!userId || !content || !postId) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const newComment = JSON.stringify({ user: userId, comment: content });
        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }
        await prisma.post.update({
            where: { id: postId },
            data: { Comments: [...post.Comments, newComment] }
        });
        return NextResponse.json({ message: "Uploaded data successfully" });
    } catch (error) {
        console.error("Error in /api/comment:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
