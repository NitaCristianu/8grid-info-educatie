"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

export interface MainMenuLinkProps {
    href: string,
    content : string,
}

export default function MainMenuLinkButton(props: MainMenuLinkProps) {
    return <Link
        href={props.href}
    >{props.content}</Link>
}