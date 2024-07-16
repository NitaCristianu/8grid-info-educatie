"use client"
import { motion } from 'framer-motion';
import { originalData } from './explorer-client-post';
import { TextTransition } from '@/app/components/TextTransition';

export default function Projectbutton(props: {
    post_data: originalData | null,
    redirect: (href: string) => Promise<void>
}) {
    const post_data = props.post_data;
    const color = post_data?.type == "Math" ? "rgb(35, 137, 209)" : "rgb(248, 117, 29)";
    const boxShadow = "0px 0px 1200px " + color;
    return <motion.div
        whileHover={{
            border: "3px solid rgba(255, 255, 255, 0.7)",
        }}
        style={{
            width: '100%',
            aspectRatio: 16 / 9,
            borderRadius: '1rem',
            background: color,
            boxShadow: boxShadow,
            border: "1.5px solid rgba(219, 219, 219, 0.65)",
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            fontFamily: "Poppins",
            fontSize: "4vh",
            fontWeight: 700,
            gap: '1rem'
        }}
    >
        {/* <TextTransition
            initial='VIEW'
            style={{
                userSelect: 'none',

            }}
        /> */}
        <motion.button
            initial={{ opacity: 1 }}
            whileHover={{ opacity: [1, 0, 0.5], transition: { duration: 0.3 } }}
            onClick={() => {
                // 0 means the logic is not editable
                props.redirect(`/logic/${0}${post_data?.id}`)
            }}
        >
            <svg viewBox="0 0 24 24" width={'4vh'} fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 12c0-2.25 3.75-7.5 10.5-7.5S22.5 9.75 22.5 12s-3.75 7.5-10.5 7.5S1.5 14.25 1.5 12zM12 16.75a4.75 4.75 0 1 0 0-9.5 4.75 4.75 0 0 0 0 9.5zM14.7 12a2.7 2.7 0 1 1-5.4 0 2.7 2.7 0 0 1 5.4 0z" fill="#fffffff"></path></g></svg>
        </motion.button>

    </motion.div>
}