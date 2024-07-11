"use client"
import { currentUser_atom, user_type, users_atom } from "@/app/variables";
import { useAtom } from "jotai";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react"

export default function UserProfile(props: { user: user_type }) {
    const { user } = props;

    return <div
        style={{
            width: '10vh',
            aspectRatio: 1,
            background: user.color
        }}
    />
}