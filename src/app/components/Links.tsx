"use client";
import { CSSProperties } from "react";
import MainMenuLinkButton from "./MainMenuLinkButton";

export default function Links(props: { style: CSSProperties }) {

    var currentUser = null;
    if (typeof (window) != 'undefined') {
        currentUser = localStorage.getItem("useId");
    }

    return <div
        style={props.style}
    >
        <MainMenuLinkButton
            href={currentUser != null ? `/account/${currentUser}` : '/login'}
            content="Profile"
        />
        <MainMenuLinkButton
            href={"/explorer"}
            content="Explorer"
        />
    </div>
}