import prisma from "@/app/libs/prisma";
import ExplorerClient from "./components/explorer-client-post";
import { redirect } from "next/navigation";

export default async function Explorer(props: { params: { id: string } }) {
    const post_data = await prisma.post.findFirst({ where: { id: props.params.id } });
    const usersdata = await prisma.user.findMany();
    async function requestPostData(id?: string) {
        "use server";
        return await prisma.post.findFirst({ where: { id: id || props.params.id } });
    };
    async function likePost(post_id: string, user_id: string) {
        "use server";
        const new_data = await prisma.post.findUnique({ where: { id: post_id } });
        if (post_data && new_data && !new_data.likes.find(id => id == user_id)) {
            await prisma.post.update({ where: { id: post_id }, data: { likes: [...new_data.likes, user_id] } });

        }
    }
    async function postComment(userId: string, comment: string) {
        "use server";
        const new_data = await prisma.post.findUnique({ where: { id: props.params.id } });
        const commentData = JSON.stringify({ user: userId, comment: comment });
        if (new_data)
            await prisma.post.update({ where: { id: props.params.id }, data: { Comments: [...new_data.Comments, commentData] } });
    }
    async function goHome() {
        "use server";
        redirect("/");
    }
    async function editProject(settings : {
        
        deleted : true, 
    }){

    }

    return <ExplorerClient
        requestPostData={requestPostData}
        like={likePost}
        postComment={postComment}
        users_data={usersdata}
        post_data={post_data}
        redirect={async (href: string) => { "use server"; redirect(href) }}
        goHome={goHome}
    />
}