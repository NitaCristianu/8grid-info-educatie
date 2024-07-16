"use client";
import { originalData } from '@/app/explorer/[id]/components/explorer-client-post';
import { motion } from 'framer-motion';
import { title } from 'process';
import { useState } from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';

export default function SettingsClient(props: {
    savePost: any,
    post: originalData,
    redirect: any,
}) {
    const [post, setPost] = useState(props.post.title);
    const [description, setDescription] = useState(props.post.Description);
    const [isPublic, setisPublic] = useState(props.post.Public);

    return <div
        style={{
            width: '50vw',
            height: '70vh',
            marginLeft: '25vw',
            marginTop: '15vh',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: "Poppins",
            alignItems: 'center',
            gap: '1vh',
        }}
    >
        <h1
            style={{
                fontWeight: "700",
                fontSize: '7vh',
                textAlign: 'center',
                marginBottom: '4vh',
            }}
        >Settings</h1>
        <div
            style={{
                display: 'flex',
                fontFamily: "Poppins",
                background: "rgba(0, 0, 0, 0.18)",
                borderRadius: '1rem',
                padding: '.5rem',
                paddingInline: '1rem',
                border: "1.5px solid rgba(231, 231, 231, 0.29)",
                zIndex: 2,
                gap: '1rem',
            }}
        >
            <h1
                style={{
                    fontWeight: 400,
                    fontSize: '3vh',
                }}
            >Title</h1>
            <motion.input
                type='text'
                style={{
                    background: 'none',
                    textAlign: 'center',
                    fontSize: '3vh',
                    fontWeight: 200,
                    outline: 'none',
                }}
                value={post}
                onChange={event => setPost(event.target.value)}

            />
        </div>
        <div
            style={{
                display: 'flex',
                fontFamily: "Poppins",
                background: "rgba(0, 0, 0, 0.18)",
                borderRadius: '1rem',
                padding: '.5rem',
                paddingInline: '1rem',
                border: "1.5px solid rgba(231, 231, 231, 0.29)",
                zIndex: 2,
                gap: '1rem',
                flexDirection: 'column',
            }}
        >
            <h1
                style={{
                    fontWeight: 400,
                    fontSize: '3vh',
                    textAlign: 'center',
                }}
            >Description</h1>
            <ReactTextareaAutosize
                style={{
                    background: 'none',
                    textAlign: 'center',
                    fontSize: '3vh',
                    fontWeight: 200,
                    outline: 'none',
                    resize: 'none',
                    width: '30vw',

                }}
                value={description}
                onChange={event => setDescription(event.target.value)}

            />
        </div>
        <div
            style={{
                display: 'flex',
                fontFamily: "Poppins",
                background: "rgba(0, 0, 0, 0.18)",
                borderRadius: '1rem',
                padding: '.5rem',
                paddingInline: '1rem',
                border: "1.5px solid rgba(231, 231, 231, 0.29)",
                zIndex: 2,
                gap: '1rem',
            }}
        >
            <h1
                style={{
                    fontWeight: 400,
                    fontSize: '3vh',
                }}
            >Public</h1>
            <motion.input
                type='checkbox'
                style={{
                    background: 'none',
                    textAlign: 'center',
                    fontSize: '3vh',
                    fontWeight: 200,
                    outline: 'none',
                    width: '3vh',
                }}
                value={`${isPublic}`}
                onChange={event => setisPublic(prev => !prev)}

            />
        </div>
        <div
            style={{
                display: 'flex',
                gap: '2rem'
            }}
        >
            <motion.button
                style={{
                    marginTop: '25vh',
                    fontSize: '3vh',
                    background: "rgba(0, 0, 0, 0.13)",
                    zIndex: 2,
                    padding: '1rem',
                    borderRadius: 32,
                    border: '1.5px solid rgba(253, 253, 253, 0.42)'
                }}
                onClick={() => {
                    props.savePost({
                        title: title,
                        description: description,
                        public: isPublic
                    });
                }}
            >Submit</motion.button>
            <motion.button
                style={{
                    marginTop: '25vh',
                    fontSize: '3vh',
                    background: "rgba(0, 0, 0, 0.13)",
                    zIndex: 2,
                    padding: '1rem',
                    borderRadius: 32,
                    border: '1.5px solid rgba(253, 253, 253, 0.42)'
                }}
                onClick={() => {
                    props.redirect("/");
                }}
            >Discard</motion.button>
            <motion.button
                style={{
                    marginTop: '25vh',
                    fontSize: '3vh',
                    background: "rgba(0, 0, 0, 0.13)",
                    zIndex: 2,
                    padding: '1rem',
                    borderRadius: 32,
                    border: '1.5px solid rgba(29, 112, 237, 0.42)',
                    color: "rgb(61, 100, 255)"
                }}
                onClick={() => {
                    props.redirect(`/${props.post.type.toLowerCase()}/${1}${props.post.id}`);

                }}
            >Edit Content</motion.button>

        </div>
    </div>
}