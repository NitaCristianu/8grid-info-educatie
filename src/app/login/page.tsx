import { PrismaClient } from "@prisma/client/extension"
import prisma from "../libs/prisma"
import LogInSignInComponent from "./components/login-sigin";
import ExitButton from "./components/upperTab";
import { redirect } from "next/navigation";
import GradientCircle from "../components/GradientCircle";

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
    redirect(`/account/${id}`)
}


export default async function Page() {
    const users = await getUsers();

    async function logIn(id: string) {
        "use server";
        redirect(`/account/${id}`)
    }

    return <div>
        {/* <GradientBackground
            color1={{ r: 37, g: 40, b: 65 }}
            color2={{ r: 108, g: 189, b: 151 }}
        /> */}

        <LogInSignInComponent
            users={users.map(user => ({ id: user.id, email: user.email, password: user.password, color: user.color }))}
            createUser={createUser}
            logIn={logIn}
            signUp={createUser}
        />
        <ExitButton exit={async () => {
            "use server";
            redirect("/")
        }} />

        <GradientCircle
            size={1.1}
            x={0}
            y={-0.55}
            color="rgba(231, 83, 83, 0.32)"
        />
        <GradientCircle
            size={0.9}
            x={-.1}
            y={0.1}
            color="rgba(70, 39, 191, 0.22)"
        />
        <GradientCircle
            size={0.9}
            x={0.2}
            y={0.1}
            color="rgba(107, 191, 39, 0.22)"
        />
    </div>
}