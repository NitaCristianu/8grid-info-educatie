import { redirect } from "next/navigation";
import prisma from "../../libs/prisma";
import ExitButton from "../../login/components/upperTab";
import AccountPageClient from "./components/AccountPageClient";
import { useState } from "react";
import { post_type } from "@/app/variables";

export default async function Home(props: { params: { id: string } }) {
  const userId = props.params.id;
  const users = await prisma.user.findMany();

  const posts = (await prisma.post.findMany({ where: { userId: userId } })).map(
    (post) => ({
      id: post.id,
      userId: userId,
      title: post.title,
      content: post.content,
      type: post.type,
      likes: post.likes,
      comments: post.Comments,
      description: post.Description,
    })
  );

  async function SaveUser(props: {
    userColor: string;
    userEmail: string;
    deleted: boolean;
    user_id: string;
  }) {
    "use server";
    if (props.deleted) {
      await prisma.user.delete({ where: { id: props.user_id } });
      redirect("/");
    } else {
      await prisma.user.update({
        where: { id: props.user_id },
        data: {
          email: props.userEmail,
          color: props.userColor,
        },
      });
    }
  }
  async function goTo(href: string) {
    "use server";
    redirect(href);
  }

  async function CreatePost(title: string, type: string) {
    "use server";
    await prisma.post.create({
      data: {
        title: title,
        type: type,
        Comments: [],
        likes: [],
        content: "",
        userId: props.params.id,
        Description: "Try modyfying the description",
      },
    });
  }

  async function getPosts() {
    "use server";
    return (await prisma.post.findMany({ where: { userId: userId } })).map(
      (post) => ({
        id: post.id,
        userId: userId,
        title: post.title,
        content: post.content,
        type: post.type,
        likes: post.likes,
        comments: post.Comments,
        description: post.Description,
      })
    );
  }

  return (
    <>
      <AccountPageClient
        Users={users}
        UserId={userId}
        SaveUser={SaveUser}
        goTo={goTo}
        posts={posts}
        CreatePost={CreatePost}
        GetPosts={getPosts}
      />
      <ExitButton
        exit={async () => {
          "use server";
          redirect("/");
        }}
      />
    </>
  );
}
