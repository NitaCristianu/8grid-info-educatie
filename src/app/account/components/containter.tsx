"use client";

import { currentUser_atom, user_type, users_atom } from "@/app/variables";
import { useAtom } from "jotai";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function Containter(props: {}) {
    const currentUserId = useAtom(currentUser_atom)[0];

    // atention
    if (currentUserId == null) redirect('./login');

    const users = useAtom<user_type[]>(users_atom)[0];
    const [user, setUser] = useState<user_type | undefined>(users.find(a => a.id == currentUserId));

    if (user == null) redirect('./login');
    useEffect(() => {
        setUser(users.find(a => a.id == currentUserId));
    }, [currentUserId]);
    return <div
        style={{
            justifyContent: 'center',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: '100%',
        }}
    >
        <div
            style={{
                width: '10vh',
                aspectRatio: 1,
                background: user.color,
                borderRadius: '100%'
            }}
        />
    </div>
}