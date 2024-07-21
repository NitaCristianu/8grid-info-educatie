"use client";
import { originalData } from '@/app/explorer/[id]/components/explorer-client-post';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ReactTextareaAutosize from 'react-textarea-autosize';

export default function SettingsClient(props: {
    savePost: any,
    post: originalData,
    redirect: any,
}) {
    const [postTitle, setPostTitle] = useState(props.post.title);
    const [description, setDescription] = useState(props.post.Description);
    const [isPublic, setisPublic] = useState(props.post.Public);

    return <div
        style={{
            width: '40vw',
            height: '70vh',
            marginLeft: '30vw',
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
                width: '100%',
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
                    fontSize: '3vh',
                    fontWeight: 200,
                    outline: 'none',
                    width: '100%'
                }}
                value={postTitle}
                onChange={event => setPostTitle(event.target.value)}

            />
        </div>
        <div
            style={{
                display: 'flex',
                width: '100%',
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
                }}
            >Description</h1>
            <textarea
                style={{
                    background: 'none',
                    fontSize: '3vh',
                    fontWeight: 200,
                    outline: 'none',
                    resize: 'none',
                    minHeight: '25vh'

                }}
                value={description}
                onChange={event => setDescription(event.target.value)}

            />
        </div>
        <div
            style={{
                display: 'flex',
                width: '100%',
                fontFamily: "Poppins",
                background: "rgba(0, 0, 0, 0.18)",
                borderRadius: '1rem',
                padding: '.5rem',
                paddingInline: '1rem',
                border: "1.5px solid rgba(231, 231, 231, 0.29)",
                zIndex: 2,
                gap: '3vw',
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
                    fontSize: '3vh',
                    fontWeight: 200,
                    outline: 'none',
                    width: '3vh',

                }}
                checked={isPublic}
                onChange={event => setisPublic(prev => !prev)}

            />
        </div>
        <div
            style={{
                display: 'flex',
                gap: '2rem',
                marginTop: '10vh'
            }}
        >
            <motion.a
                whileHover={{
                    opacity: 0.7,
                    scale: 1.06
                }}
                style={{
                    fontSize: '3vh',
                    background: "rgba(89, 134, 89, 0.23)",
                    zIndex: 2,
                    padding: '1rem',
                    borderRadius: '1.3rem',
                    border: '1.5px solid rgba(180, 243, 153, 0.42)',
                    color: "rgb(202, 255, 174)",
                    display: 'flex',
                    gap: '.7rem',
                    paddingLeft: '1.4rem'
                }}
                onClick={() => {
                    props.savePost({
                        title: postTitle,
                        description: description,
                        public: isPublic
                    });
                }}
                href={`/explorer/${props.post.id}`}
            >Submit
                <svg width={'5vh'} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M5.5 12.0002C5.50024 8.66068 7.85944 5.78639 11.1348 5.1351C14.4102 4.48382 17.6895 6.23693 18.9673 9.32231C20.2451 12.4077 19.1655 15.966 16.3887 17.8212C13.6119 19.6764 9.91127 19.3117 7.55 16.9502C6.23728 15.6373 5.49987 13.8568 5.5 12.0002Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M9 12.0002L11.333 14.3332L16 9.66724" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
            </motion.a>
            <motion.a
                whileHover={{
                    opacity: 0.7,
                    scale: 1.06
                }}
                style={{
                    fontSize: '3vh',
                    background: "rgba(65, 125, 222, 0.13)",
                    zIndex: 2,
                    padding: '1rem',
                    borderRadius: '1.3rem',
                    border: '1.5px solid rgba(29, 112, 237, 0.42)',
                    color: "rgb(61, 100, 255)",
                    display: 'flex',
                    gap: '1rem'
                }}
                href={`/${props.post.type.toLowerCase()}/${1}${props.post.id}`}
            >Edit Content
                <svg style={{ marginBottom: "0.5vh" }} width={'3.4vh'} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title></title> <g id="Complete"> <g id="edit"> <g> <path d="M20,16v4a2,2,0,0,1-2,2H4a2,2,0,0,1-2-2V6A2,2,0,0,1,4,4H8" fill="none" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path> <polygon fill="none" points="12.5 15.8 22 6.2 17.8 2 8.3 11.5 8 16 12.5 15.8" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></polygon> </g> </g> </g> </g></svg>
            </motion.a>
            <motion.a
                whileHover={{
                    opacity: 0.7,
                    scale: 1.06
                }}
                style={{
                    fontSize: '3vh',
                    background: "rgba(244, 244, 117, 0.03)",
                    paddingLeft: '1.4rem',
                    zIndex: 2,
                    padding: '1rem',
                    borderRadius: '1.3rem',
                    border: '1.5px solid rgba(251, 217, 121, 0.42)',
                    color: "rgb(251, 246, 149)",
                    display: 'flex',
                    gap: '0.7rem'
                }}
                href='/'
            >Discard
                <svg width={'5vh'} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M5.5 12.0002C5.50024 8.66068 7.85944 5.78639 11.1348 5.1351C14.4102 4.48382 17.6895 6.23693 18.9673 9.32231C20.2451 12.4077 19.1655 15.966 16.3887 17.8212C13.6119 19.6764 9.91127 19.3117 7.55 16.9502C6.23728 15.6373 5.49987 13.8568 5.5 12.0002Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M9.34477 14.0937C9.05182 14.3866 9.05173 14.8614 9.34457 15.1544C9.63741 15.4473 10.1123 15.4474 10.4052 15.1546L9.34477 14.0937ZM13.0302 12.5306C13.3232 12.2377 13.3233 11.7629 13.0304 11.4699C12.7376 11.177 12.2627 11.1769 11.9698 11.4697L13.0302 12.5306ZM11.9695 11.47C11.6767 11.763 11.6769 12.2379 11.9699 12.5307C12.2629 12.8235 12.7378 12.8233 13.0305 12.5303L11.9695 11.47ZM15.6545 9.90427C15.9473 9.61127 15.9471 9.1364 15.6541 8.84361C15.3611 8.55083 14.8862 8.55101 14.5935 8.84402L15.6545 9.90427ZM13.0302 11.4697C12.7373 11.1769 12.2624 11.177 11.9696 11.4699C11.6767 11.7629 11.6768 12.2377 11.9698 12.5306L13.0302 11.4697ZM14.5948 15.1546C14.8877 15.4474 15.3626 15.4473 15.6554 15.1544C15.9483 14.8614 15.9482 14.3866 15.6552 14.0937L14.5948 15.1546ZM11.9696 12.5304C12.2624 12.8233 12.7373 12.8234 13.0302 12.5306C13.3232 12.2377 13.3233 11.7629 13.0304 11.4699L11.9696 12.5304ZM10.4054 8.84392C10.1126 8.55097 9.63772 8.55088 9.34477 8.84371C9.05182 9.13655 9.05173 9.61143 9.34457 9.90437L10.4054 8.84392ZM10.4052 15.1546L13.0302 12.5306L11.9698 11.4697L9.34477 14.0937L10.4052 15.1546ZM13.0305 12.5303L15.6545 9.90427L14.5935 8.84402L11.9695 11.47L13.0305 12.5303ZM11.9698 12.5306L14.5948 15.1546L15.6552 14.0937L13.0302 11.4697L11.9698 12.5306ZM13.0304 11.4699L10.4054 8.84392L9.34457 9.90437L11.9696 12.5304L13.0304 11.4699Z" fill="#ffffff"></path> </g></svg>
            </motion.a>

        </div>
    </div>
}