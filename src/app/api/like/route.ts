import prisma from "@/app/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userId, content, postId } = await req.json();

        if (!userId || !content || !postId) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        console.log({ userId, content, postId });

        await prisma.post.findUnique({
            where: { id: postId }
        });

        return NextResponse.json({ message: "Success" });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
