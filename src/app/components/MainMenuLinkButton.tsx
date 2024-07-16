"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button3D from './3dbutton';
import { redirect } from 'next/navigation';

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