import { redirect } from "next/navigation";
import prisma from "../../libs/prisma";
import ExitButton from "../../login/components/BottomExitButton";
import Container from "./components/containter";

export default async function Home(props: { params: { id: string } }) {
    async function SaveUser(props: { userColor: string, userEmail: string, deleted: boolean, user_id: string }) {
        "use server";
        if (props.deleted) {
            await prisma.user.delete({ where: { id: props.user_id } })
            redirect('/')
        } else {
            await prisma.user.update({
                where: { id: props.user_id },
                data: {
                    email: props.userEmail,
                    color: props.userColor,

                }

            })
        }
    }

    const userId = props.params.id;
    const users = await prisma.user.findMany();

    return <>
        <Container Users={users} UserId = {userId} SaveUser={SaveUser} />
        <ExitButton exit={async () => {
            "use server";
            redirect("/")
        }} />
    </>
}