import { useEffect, useState } from "react";
import { originalData } from "./explorer-client-post";
import { motion } from 'framer-motion';
import { user_type } from "@/app/variables";
import ReactTextareaAutosize from "react-textarea-autosize";

export default function Comments(props: {
    post_id: string
}) {
    // the comment sections comment
    // necessary comment data
    const [comment, setCommentPost] = useState("");
    const [userId, setUserId] = useState(typeof (window) != "undefined" ? localStorage.getItem("userId") : null);
    const [users, setUsers] = useState<user_type[] | null>(null);
    const [comments, setComments] = useState<any[]>([]);

    // get user and post data
    useEffect(() => {
        fetch('/api/user', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
        })
            .then((response) => response.json())
            .then((d) => {
                setUsers(d);
                setUserId(typeof (window) != 'undefined' ? localStorage.getItem("userId") : null);
            })
            .catch((error) => console.log('error', error));
        fetch('/api/post', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
        })
            .then((response) => response.json())
            .then((d: originalData[]) => {
                const comments_d = d.find(post => post.id == props.post_id)?.Comments || [];
                setComments(comments_d)
            })
            .catch((error) => console.log('error', error));

    }, [])

    return <div
        style={{
            width: '43%',
            height: '100%',
            display: 'flex',
            gap: '2rem',
            marginTop: "6vh",
            flexDirection: 'column'

        }}
    >
        {userId && userId.length > 0 ? <div
            style={{
                height: '20vh',
                width: '100%',
                background: "rgba(0, 0, 0, 0.21)",
                border: '1.5px solid rgba(228, 228, 228, 0.31)',
                borderRadius: '1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                padding: '1rem',
            }}
        >

            <textarea
                style={{
                    background: 'none',
                    outline: 'none',
                    width: "100%",
                    resize: 'none',
                    fontFamily: "Poppins",

                }}
                placeholder="Write a comment"
                value={comment}
                onChange={event => setCommentPost(event.target.value)}
            />
            <motion.button
                style={{
                    position: 'fixed',
                    left: 'calc(100% - 6rem)',
                    top: 'calc(20vh)',
                }}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                    // try comments if all data is valid
                    if (userId && userId.length > 0 && comment.length > 0 && props.post_id && props.post_id.length > 0) {
                        fetch('/api/comment', {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            method: 'POST',
                            body: JSON.stringify({ userId, postId: props.post_id, content: comment }),
                        })
                            .catch((error) => console.log('error', error));

                        setCommentPost("");
                        setComments(prev => [...prev, JSON.stringify({ user: userId, comment: comment })]);
                    }
                }}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    width={32}
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                        <path
                            d="M11.5003 12H5.41872M5.24634 12.7972L4.24158 15.7986C3.69128 17.4424 3.41613 18.2643 3.61359 18.7704C3.78506 19.21 4.15335 19.5432 4.6078 19.6701C5.13111 19.8161 5.92151 19.4604 7.50231 18.7491L17.6367 14.1886C19.1797 13.4942 19.9512 13.1471 20.1896 12.6648C20.3968 12.2458 20.3968 11.7541 20.1896 11.3351C19.9512 10.8529 19.1797 10.5057 17.6367 9.81135L7.48483 5.24303C5.90879 4.53382 5.12078 4.17921 4.59799 4.32468C4.14397 4.45101 3.77572 4.78336 3.60365 5.22209C3.40551 5.72728 3.67772 6.54741 4.22215 8.18767L5.24829 11.2793C5.34179 11.561 5.38855 11.7019 5.407 11.8459C5.42338 11.9738 5.42321 12.1032 5.40651 12.231C5.38768 12.375 5.34057 12.5157 5.24634 12.7972Z"
                            stroke="#ffffff"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        ></path>
                    </g>
                </svg>
            </motion.button>
        </div> : null}
        <div
            style={{
                height: '100%',
                width: '100%',
                display: 'flex',
                gap: '.5rem',
                flexDirection: 'column',
            }}
        >
            {comments.map((comment, i) => {
                const commentData = JSON.parse(comment) as { user: string, comment: string };
                if (!commentData.user || !commentData.comment || !users) return null;
                const user = (users || []).find(user => user.id == commentData.user);
                if (!user) return null;
                // map the components into cards if possible
                return <div
                    key={comment + i.toFixed(0)}
                    style={{
                        width: '100%',
                        borderRadius: '1rem',
                        background: "rgba(0, 0, 0, 0.21)",
                        border: '1.5px solid rgba(228, 228, 228, 0.31)',
                        padding: '1rem',
                        fontFamily: "Poppins",
                        display: 'flex',
                        gap: '2rem',
                        alignItems: 'center'

                    }}
                >
                    <div
                        style={{
                            width: '4rem',
                            padding: '1rem',
                            aspectRatio: 1,
                            border: "2px solid white",
                            borderRadius: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: user.color
                        }}
                    >
                        <svg
                            viewBox="0 0 20 20"
                            width="2rem"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#ffffff"
                        >
                            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                            <g
                                id="SVGRepo_tracerCarrier"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></g>
                            <g id="SVGRepo_iconCarrier">
                                <title>profile_round [#1342]</title>
                                <desc>Created with Sketch.</desc>
                                <defs></defs>
                                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                                    <g
                                        id="Dribbble-Light-Preview"
                                        transform="translate(-140.000000, -2159.000000)"
                                        fill="#ffffff"
                                    >
                                        <g id="icons" transform="translate(56.000000, 160.000000)">
                                            <path d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598" />
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: "column",
                        }}
                    >
                        <h1
                            style={{
                                fontWeight: 700
                            }}
                        >{user.id}</h1>
                        <ReactTextareaAutosize
                            style={{
                                background: 'none',
                                resize: 'none',
                                outline: 'none',
                            }}
                            contentEditable={false}
                            value={commentData.comment}
                        >{commentData.comment}</ReactTextareaAutosize>
                    </div>
                </div>
            })}
        </div>
    </div>
}