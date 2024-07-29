"use client";
import { motion } from 'framer-motion';

export interface MainMenuLinkProps {
    href: string,
    content: string,
}

export default function MainMenuLinkButton(props: MainMenuLinkProps) {
    // return <Button3D
    //     content={props.content}
    //     ontap={props.redirect(props.href)}
    // />
    // the redirecting button used to redirect user to other pages
    return <motion.a

        whileHover={{
            scale: 1.1,
            textShadow: "0px 0px 10px rgba(249, 249, 249, .9)",
            fontWeight : 400,
        }}
        style={{
            fontFamily: "Poppins",
            fontSize: '2vh',
            fontWeight: 300,
            textShadow: "0px 0px 5px rgba(249, 249, 249, .5)",

        }}
        href={props.href}
    >{props.content}</motion.a>
}