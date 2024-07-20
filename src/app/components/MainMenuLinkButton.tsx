"use client";
import Link from 'next/link';

export interface MainMenuLinkProps {
    href: string,
    content: string,
}

export default function MainMenuLinkButton(props: MainMenuLinkProps) {
    // return <Button3D
    //     content={props.content}
    //     ontap={props.redirect(props.href)}
    // />
    return <Link
        href={props.href}
    >{props.content}</Link>
}