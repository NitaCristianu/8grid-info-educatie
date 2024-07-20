import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/app/libs/prisma";

export async function GET(req: Request) {
    const users: { id: string, password: string }[] = await prisma.user.findMany();
    const data = JSON.stringify(users);
    return new Response(data);
}

export async function POST(req: Request) {
    const data: { id: string, password: string, email: string, color?: string, update?: boolean, delete?: boolean } = await req.json();

    if (data.delete) {
        await prisma.user.delete({
            where: { id: data.id }
        })
        return NextResponse.json({ message: "uploaded data success" });
    }
    if (data.update) {
        console.log("updating user")
        await prisma.user.update({
            where: { id: data.id },
            data: {
                password: data.password,
                email: data.email,
                color: data.color,
            }
        })
        return NextResponse.json({ message: "uploaded data success" });
    }
    const users = await prisma.user.findMany();
    if (users.findIndex(user => user.id == data.id) == -1) {
        await prisma.user.create({
            data: {
                password: data.password,
                id: data.id,
                email: data.email,
            }
        })
    }
}