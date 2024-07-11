import { PrismaClient } from "@prisma/client/extension"
import prisma from "../libs/prisma"
import LogInSignInComponent from "./components/login-sigin";
import GradientBackground from "./components/GradientBackground";
import ExitButton from "./components/BottomExitButton";
import { redirect } from "next/navigation";

async function getUsers() {
    const users = await prisma.user.findMany();

    return users;
}

async function createUser(id: string, password: string, email = "") {
    "use server"
    await prisma.user.create({
        data: {
            id, password, email: email
        }
    })
    redirect('/account')
}


export default async function Page() {
    const users = await getUsers();

    async function logIn(id: string) {
        "use server";
        redirect('/account')
    }

    return <div>
        <GradientBackground
            color1={{ r: 37, g: 40, b: 65 }}
            color2={{ r: 108, g: 189, b: 151 }}
        />
        <LogInSignInComponent
            users={users.map(user => ({ id: user.id, email: user.email, password: user.password, color : user.color }))}
            createUser={createUser}
            logIn={logIn}
            signUp={createUser}
        />
        <ExitButton />
    </div>
}