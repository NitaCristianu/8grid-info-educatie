"use client";
import { CSSProperties } from "react";
import MainMenuLinkButton from "./MainMenuLinkButton";
import { useAtom } from "jotai";
import { currentUser_atom } from "../variables";

export default function Links(props: { style: CSSProperties }) {

    const currentUser = useAtom(currentUser_atom)[0];

    return <div
        style={props.style}
    >
        <MainMenuLinkButton
            href={currentUser != null ? `/account/${currentUser}` : '/login'}
            content="Profile"
        />
        <MainMenuLinkButton
            href={""}
            content="kArewrt"
        />
    </div>
}