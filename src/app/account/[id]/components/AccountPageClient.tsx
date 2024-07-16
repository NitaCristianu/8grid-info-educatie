"use client";

import GradientCircle from "@/app/components/GradientCircle";
import { currentUser_atom, post_type, user_type, users_atom } from "@/app/variables";
import { useAtom } from "jotai";
import { redirect } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { color, motion } from 'framer-motion';
import { v4 } from "uuid";
import { rotate } from "three/examples/jsm/nodes/Nodes.js";

const POSTS_PER_PAGE = 5;

function OptionButton(props: { callback: () => void, content: string, color?: string }) {
    return <motion.button
        onCanPlay={props.callback}
        style={{
            fontSize: '2.5vh',
            backdropFilter: "blur(3px)",
            background: "rgba(49, 49, 59, 0.22)",
            padding: '1vh',
            borderRadius: '1rem',
            border: "1.5px solid rgba(213, 213, 213, 0.34)",
            width: "30vh",
            color: props.color || 'white'

        }}
        whileHover={{
            background: "rgba(29,29,29,0.4)",
        }}
        onClick={props.callback}
    >{props.content}</motion.button>
}

function PostPad(props: {
    name: string,
    type: 'logic' | 'math',
    color?: string,
    id?: string,
    goTo?: (href: string) => Promise<void>,
}) {
    return <motion.div
        whileHover={{
            background: "rgba(29,29,29,0.4)",
            color: props.color || 'white',
        }}
        style={{
            background: "rgba(31, 31, 31, 0.17)",
            borderRadius: '1rem',
            border: '1.5px solid rgba(255, 255, 255, 0.26)',
            display: 'flex',
            alignItems: 'center',
            padding: '3rem',
            width: '100%',
            height: `0.4vh`,
            fontFamily: "Poppins"
        }}
    >
        <h1
            style={{
                userSelect: 'none',
                fontSize: '2.3vh',
            }}
        >{props.name}</h1>
        <div
            style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '2vw'
            }}
        >
            {/*
            EYE
            */}
            <motion.button
                initial={{ opacity: 1 }}
                whileHover={{ opacity: [1, 0, 0.5], transition: { duration: 0.3 } }}
                onClick={() => props.goTo && props.id ? props.goTo(`/explorer/${props.id}`) : null}
            >
                <svg viewBox="0 0 24 24" width={'4vh'} fill="#ffffff" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 12c0-2.25 3.75-7.5 10.5-7.5S22.5 9.75 22.5 12s-3.75 7.5-10.5 7.5S1.5 14.25 1.5 12zM12 16.75a4.75 4.75 0 1 0 0-9.5 4.75 4.75 0 0 0 0 9.5zM14.7 12a2.7 2.7 0 1 1-5.4 0 2.7 2.7 0 0 1 5.4 0z" fill="#fffffff"></path></g></svg>
            </motion.button>
            <motion.button
                whileHover={{ opacity: 0.5, rotate: 180 }}
                onClick={() => props.goTo && props.id ? props.goTo(`/settings/${props.id}`) : null}
            >
                <svg viewBox="0 0 24 24" fill="#ffffff" width={'4vh'} xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M14.2788 2.15224C13.9085 2 13.439 2 12.5 2C11.561 2 11.0915 2 10.7212 2.15224C10.2274 2.35523 9.83509 2.74458 9.63056 3.23463C9.53719 3.45834 9.50065 3.7185 9.48635 4.09799C9.46534 4.65568 9.17716 5.17189 8.69017 5.45093C8.20318 5.72996 7.60864 5.71954 7.11149 5.45876C6.77318 5.2813 6.52789 5.18262 6.28599 5.15102C5.75609 5.08178 5.22018 5.22429 4.79616 5.5472C4.47814 5.78938 4.24339 6.1929 3.7739 6.99993C3.30441 7.80697 3.06967 8.21048 3.01735 8.60491C2.94758 9.1308 3.09118 9.66266 3.41655 10.0835C3.56506 10.2756 3.77377 10.437 4.0977 10.639C4.57391 10.936 4.88032 11.4419 4.88029 12C4.88026 12.5581 4.57386 13.0639 4.0977 13.3608C3.77372 13.5629 3.56497 13.7244 3.41645 13.9165C3.09108 14.3373 2.94749 14.8691 3.01725 15.395C3.06957 15.7894 3.30432 16.193 3.7738 17C4.24329 17.807 4.47804 18.2106 4.79606 18.4527C5.22008 18.7756 5.75599 18.9181 6.28589 18.8489C6.52778 18.8173 6.77305 18.7186 7.11133 18.5412C7.60852 18.2804 8.2031 18.27 8.69012 18.549C9.17714 18.8281 9.46533 19.3443 9.48635 19.9021C9.50065 20.2815 9.53719 20.5417 9.63056 20.7654C9.83509 21.2554 10.2274 21.6448 10.7212 21.8478C11.0915 22 11.561 22 12.5 22C13.439 22 13.9085 22 14.2788 21.8478C14.7726 21.6448 15.1649 21.2554 15.3694 20.7654C15.4628 20.5417 15.4994 20.2815 15.5137 19.902C15.5347 19.3443 15.8228 18.8281 16.3098 18.549C16.7968 18.2699 17.3914 18.2804 17.8886 18.5412C18.2269 18.7186 18.4721 18.8172 18.714 18.8488C19.2439 18.9181 19.7798 18.7756 20.2038 18.4527C20.5219 18.2105 20.7566 17.807 21.2261 16.9999C21.6956 16.1929 21.9303 15.7894 21.9827 15.395C22.0524 14.8691 21.9088 14.3372 21.5835 13.9164C21.4349 13.7243 21.2262 13.5628 20.9022 13.3608C20.4261 13.0639 20.1197 12.558 20.1197 11.9999C20.1197 11.4418 20.4261 10.9361 20.9022 10.6392C21.2263 10.4371 21.435 10.2757 21.5836 10.0835C21.9089 9.66273 22.0525 9.13087 21.9828 8.60497C21.9304 8.21055 21.6957 7.80703 21.2262 7C20.7567 6.19297 20.522 5.78945 20.2039 5.54727C19.7799 5.22436 19.244 5.08185 18.7141 5.15109C18.4722 5.18269 18.2269 5.28136 17.8887 5.4588C17.3915 5.71959 16.7969 5.73002 16.3099 5.45096C15.8229 5.17191 15.5347 4.65566 15.5136 4.09794C15.4993 3.71848 15.4628 3.45833 15.3694 3.23463C15.1649 2.74458 14.7726 2.35523 14.2788 2.15224ZM12.5 15C14.1695 15 15.5228 13.6569 15.5228 12C15.5228 10.3431 14.1695 9 12.5 9C10.8305 9 9.47716 10.3431 9.47716 12C9.47716 13.6569 10.8305 15 12.5 15Z" fill="#ffffff"></path> </g></svg>
            </motion.button>
        </div>
    </motion.div>
}


export default function AccountPageClient(props: {
    SaveUser: (props: { userColor: string, userEmail: string, deleted: boolean, user_id: string }) => Promise<void>,
    CreatePost: (title: string, type: string) => Promise<void>,
    GetPosts: () => Promise<post_type[]>,
    goTo: (href: string) => Promise<void>,
    UserId: string,
    Users: user_type[],
    posts: post_type[],
}) {
    const setCurrentUserId = useAtom(currentUser_atom)[1];
    const currentUserId = props.UserId;

    // atention
    if (currentUserId == null) redirect('/');

    const users = props.Users;
    const [user, setUser] = useState<user_type | undefined>(users.find(a => a.id == currentUserId));

    const [posts, setPosts] = useState(props.posts);

    const [leftSide, setLeftSide] = useState(false);
    if (user == null) redirect('/');
    const [userColor, setuserColor] = useState(user.color);
    const [mode, setMode] = useState<"posts" | "account">("posts");
    const [page, setPage] = useState<number>(0);
    const [creating, setCreating] = useState(false);

    if (window != undefined) {
        window.localStorage.setItem('userId', user.id);
    }
    setCurrentUserId(user.id)
    const post_num = posts.length;
    const firstPostIndex = page * POSTS_PER_PAGE;
    const lastPostIndex = Math.min(firstPostIndex + POSTS_PER_PAGE, post_num);
    const [projectName, setProjectName] = useState("");
    const [selectedType, setSelectedType] = useState("");

    return <>
        <div
            style={{
                justifyContent: 'center',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                height: 'calc(100%-10vh)',
                flexDirection: 'column',
                gap: '3vh',
                fontFamily: "Poppins",
                position: "fixed",
                left: leftSide ? "-50vh" : 0,
                top: '10vh',
                transition: "left 0.35s ease-in-out"
            }}
        >
            <GradientCircle
                x={-.4}
                y={-1.5}
                color={userColor}
                opacity={0.3}
                size={1.8}
            />
            <GradientCircle
                x={.2}
                y={-.4}
                color={"rgba(51, 18, 104, 0.5)"}
                size={1.8}
            />
            <GradientCircle
                x={-1}
                y={-.4}
                color={"rgba(39, 84, 230, 0.2)"}
                size={1.8}
            />
            <div
                style={{
                    marginTop: '10vh',
                    width: '20vh',
                    alignSelf: 'center',
                    aspectRatio: 1,
                    background: userColor,
                    borderRadius: '100%',
                    border: "5px solid white",
                    display: 'flex',
                    justifyContent: 'center',

                }}
            >
                <svg viewBox="0 0 20 20" width={'50%'} xmlns="http://www.w3.org/2000/svg" fill="#ffffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>profile_round [#1342]</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"> <g id="Dribbble-Light-Preview" transform="translate(-140.000000, -2159.000000)" fill="#ffffff"> <g id="icons" transform="translate(56.000000, 160.000000)"> <path d="M100.562548,2016.99998 L87.4381713,2016.99998 C86.7317804,2016.99998 86.2101535,2016.30298 86.4765813,2015.66198 C87.7127655,2012.69798 90.6169306,2010.99998 93.9998492,2010.99998 C97.3837885,2010.99998 100.287954,2012.69798 101.524138,2015.66198 C101.790566,2016.30298 101.268939,2016.99998 100.562548,2016.99998 M89.9166645,2004.99998 C89.9166645,2002.79398 91.7489936,2000.99998 93.9998492,2000.99998 C96.2517256,2000.99998 98.0830339,2002.79398 98.0830339,2004.99998 C98.0830339,2007.20598 96.2517256,2008.99998 93.9998492,2008.99998 C91.7489936,2008.99998 89.9166645,2007.20598 89.9166645,2004.99998 M103.955674,2016.63598 C103.213556,2013.27698 100.892265,2010.79798 97.837022,2009.67298 C99.4560048,2008.39598 100.400241,2006.33098 100.053171,2004.06998 C99.6509769,2001.44698 97.4235996,1999.34798 94.7348224,1999.04198 C91.0232075,1998.61898 87.8750721,2001.44898 87.8750721,2004.99998 C87.8750721,2006.88998 88.7692896,2008.57398 90.1636971,2009.67298 C87.1074334,2010.79798 84.7871636,2013.27698 84.044024,2016.63598 C83.7745338,2017.85698 84.7789973,2018.99998 86.0539717,2018.99998 L101.945727,2018.99998 C103.221722,2018.99998 104.226185,2017.85698 103.955674,2016.63598" id="profile_round-[#1342]"> </path> </g> </g> </g> </g></svg>
            </div>
            <h1
                style={{
                    fontWeight: 'bolder',
                    fontSize: '3vh'
                }}
            >Welcome {currentUserId}</h1>
            <div
                style={{
                    marginTop: "5vh",
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2vh'
                }}
            >
                <OptionButton
                    callback={() => {
                        setLeftSide(true);
                        setMode('posts');
                    }}
                    content="Posts"
                />
                <OptionButton
                    callback={() => {
                        setMode('account');
                        setLeftSide(true);
                    }}
                    content="Manage Account"
                />
            </div>
            <div
                style={{
                    left: leftSide ? '45vw' : '100vw',
                    position: 'fixed',
                    height: '92vh',
                    width: '40vw',
                    top: '8vh',
                    aspectRatio: 1.2,
                    display: 'flex',
                    justifyContent: 'center',
                    flexDirection: 'column',
                    alignItems: "center",
                    borderRadius: 32,
                    transition: "left 0.3s ease-in-out",
                }}
            >
                {mode == 'account' ? <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        alignItems: "center",
                        height: 'calc(100%-10vh)',

                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            gap: '1vh',
                            background: "rgba(12, 12, 12, 0.2)",
                            borderRadius: '1rem',
                            padding: '.5rem',
                            border: '1.5px solid rgba(253, 253, 253, 0.21)',
                            width: '35vh',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <h1
                            style={{
                                fontFamily: "Poppins",
                                alignItems: 'center',
                                fontWeight: 300
                            }}
                        >Change user color</h1>
                        <input
                            type="color"
                            value={userColor}
                            placeholder={userColor}
                            onChange={(event) => setuserColor(event.target.value)}
                            style={{
                                background: 'none',
                                outline: 'none',
                                width: '3rem',
                                height: '2rem'
                            }}
                        />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        style={{
                            marginTop: '4vh',
                            fontWeight: '500',
                            fontSize: '3vh',
                            fontFamily: "Poppins",
                        }}
                        onClick={() => {
                            props.SaveUser({
                                userColor: userColor,
                                userEmail: user.email,
                                user_id: user.id,
                                deleted: false,
                            });
                            setLeftSide(false);
                        }}

                    >Save</motion.button>

                    <div
                        style={{
                            display: 'flex',
                            marginTop: '10vh',
                            flexDirection: 'column',
                            gap: '2vh'
                        }}
                    >
                        <OptionButton
                            callback={() => {
                                setCurrentUserId(null);
                                setLeftSide(false);
                                props.goTo("/");
                            }}
                            content="Log out"
                        />
                        <OptionButton
                            callback={() => {
                                setCurrentUserId(null);
                                setLeftSide(false);
                                props.goTo("/");
                            }}
                            color={userColor}
                            content="Delete user"
                        />
                    </div>
                </div> : mode == "posts" ? <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        flexDirection: 'column',
                        alignItems: "center",
                    }}
                >
                    <h1
                        style={{
                            fontWeight: 600,
                            fontSize: '3vh',

                        }}
                    >{user.id}'s posts</h1>
                    <br />
                    <div
                        style={{
                            background: "rgba(11, 11, 11, 0.19)",
                            borderRadius: '1rem',
                            height: '8vh',
                            width: '60vh',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: "row",
                            padding: '1rem',
                            gap: '1rem',
                            border: '1.5px solid rgba(255, 255, 255, 0.26)',
                        }}
                    >
                        <motion.button
                            whileHover={{ background: "rgba(0, 0, 0, 0.24)" }}
                            style={{
                                background: "rgba(31, 31, 31, 0.17)",
                                borderRadius: '1rem',
                                width: '50%',
                                height: '100%',
                                fontSize: '3vh',
                                color: userColor,
                                textShadow: `0px 0px 10px ${userColor}`,
                                border: '1.5px solid rgba(255, 255, 255, 0.26)'
                            }}
                            onClick={() => {
                                setCreating(true);
                            }}
                        >Create</motion.button>
                        <motion.button
                            whileHover={{ background: "rgba(0, 0, 0, 0.24)" }}
                            style={{
                                background: "rgba(31, 31, 31, 0.17)",
                                borderRadius: '1rem',
                                width: '50%',
                                height: '100%',
                                fontSize: '3vh',
                                color: "white",
                                textShadow: "0px 0px 10px white",
                                border: '1.5px solid rgba(255, 255, 255, 0.26)'
                            }}
                        >Delete</motion.button>
                        <motion.button
                            whileHover={{ background: "rgba(0, 0, 0, 0.24)" }}
                            style={{
                                background: "rgba(31, 31, 31, 0.17)",
                                borderRadius: '1rem',
                                height: '100%',
                                aspectRatio: 1,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '3vh',
                                color: "white",
                                textShadow: "0px 0px 10px white",
                                border: '1.5px solid rgba(255, 255, 255, 0.26)'
                            }}
                        >
                            <motion.div
                                whileHover={{ rotate: 30 }}
                                whileTap={{ rotate: 360 }}
                                onClick={() => { props.GetPosts().then(posts => setPosts(posts)) }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width={'3.2vh'} fill="#ffffff" viewBox="0 0 24 24"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path></g></svg>
                            </motion.div>
                        </motion.button>
                    </div>
                    <div
                        style={{
                            width: '100%',
                            height: '60vh',
                            marginTop: '2vh',
                            display: 'flex',
                            flexDirection: 'column',
                            padding: '1vh',
                            gap: "1vh"
                        }}
                    >
                        {posts.slice(firstPostIndex, lastPostIndex).map(post => <PostPad
                            name={post.title}
                            type={post.type as "math" | "logic"}
                            color={userColor}
                            id={post.id}
                            goTo={props.goTo}
                        />)}
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            gap: '3vw'
                        }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            style={{
                                scaleX: 1,
                                backgroundColor: "rgba(0, 0, 0, 0.17)",
                                padding: '2vh',
                                borderRadius: '100%',
                                border: "1.5px solid rgba(255, 255, 255, 0.34)",
                                opacity: page * POSTS_PER_PAGE - POSTS_PER_PAGE >= 0 ? 1 : 0,
                                cursor: page * POSTS_PER_PAGE - POSTS_PER_PAGE >= 0 ? "pointer" : 'default',
                                transition: "opacity 0.2s ease-in-out"
                            }}
                            onClick={() => { setPage(prev => page * POSTS_PER_PAGE - POSTS_PER_PAGE >= 0 ? prev - 1 : prev) }}

                        >
                            <svg fill="#ffffff" width={'3vh'} viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="2.88"></g><g id="SVGRepo_iconCarrier"><title></title><path d="M39.3756,48.0022l30.47-25.39a6.0035,6.0035,0,0,0-7.6878-9.223L26.1563,43.3906a6.0092,6.0092,0,0,0,0,9.2231L62.1578,82.615a6.0035,6.0035,0,0,0,7.6878-9.2231Z"></path></g></svg>
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            style={{
                                scaleX: -1,
                                backgroundColor: "rgba(0, 0, 0, 0.17)",
                                padding: '2vh',
                                borderRadius: '100%',
                                opacity: page * POSTS_PER_PAGE + POSTS_PER_PAGE < post_num ? 1 : 0,
                                transition: "opacity 0.2s ease-in-out",
                                cursor: page * POSTS_PER_PAGE + POSTS_PER_PAGE < post_num ? "pointer" : 'default',
                                border: "1.5px solid rgba(255, 255, 255, 0.34)"
                            }}
                            onClick={() => { setPage(prev => page * POSTS_PER_PAGE + POSTS_PER_PAGE < post_num ? prev + 1 : prev) }}
                        >
                            <svg fill="#ffffff" width={'3vh'} viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="2.88"></g><g id="SVGRepo_iconCarrier"><title></title><path d="M39.3756,48.0022l30.47-25.39a6.0035,6.0035,0,0,0-7.6878-9.223L26.1563,43.3906a6.0092,6.0092,0,0,0,0,9.2231L62.1578,82.615a6.0035,6.0035,0,0,0,7.6878-9.2231Z"></path></g></svg>
                        </motion.button>

                    </div>
                </div> : null}
            </div>
        </div >
        <div
            style={{
                width: '100vw',
                height: '100vh',
                backdropFilter: creating ? "blur(15px)" : 'none',
                transition: 'backdropFilter 0.5s ease-in-out',
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex',
                pointerEvents: creating ? 'all' : 'none'
            }}
        >
            <div
                style={{
                    border: "1.5px solid rgba(211, 211, 211, 0.36)",
                    marginTop: '10vh',
                    background: "rgba(24, 24, 24, 0.24)",
                    opacity: creating ? 1 : 0,
                    transition: 'opacity .3s ease-in-out',
                    width: '30vw',
                    height: '60vh',
                    borderRadius: '3rem',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: "7vh",
                    fontFamily: "Poppins",
                    gap: '4vh'
                }}
            >
                <input
                    type="text"
                    placeholder="Project name"
                    value={projectName}
                    style={{
                        background: "none",
                        outline: 'none',
                        width: '100%',
                        textAlign: 'center',
                        fontSize: "3vh",

                    }}
                    onChange={event => setProjectName(event.target.value)}
                />
                <div
                    style={{
                        width: '100%',
                        height: '9vh',
                        background: "rgba(12, 12, 12, 0.28)",
                        borderRadius: '1rem',
                        border: "1.5px solid rgba(211, 211, 211, 0.36)",
                        padding: '1rem',
                        gap: '1rem',
                        flexDirection: 'row',
                        display: 'flex'
                    }}
                >
                    <motion.button
                        whileHover={{ color: userColor, borderColor: userColor }}
                        style={{
                            width: '100%',
                            height: '100%',
                            background: "rgba(19, 19, 19, 0.33)",
                            border: "1.5px solid rgba(211, 211, 211, 0.36)",
                            borderRadius: '1rem',
                            color: selectedType == 'Math' ? userColor : 'white',
                            borderColor: selectedType == 'Math' ? userColor : 'rgb(211,211,211,0.36)',

                        }}
                        onClick={() => setSelectedType('Math')}
                    >Math</motion.button>
                    <motion.button
                        whileHover={{ color: userColor, borderColor: userColor }}
                        style={{
                            width: '100%',
                            height: '100%',
                            background: "rgba(19, 19, 19, 0.33)",
                            border: "1.5px solid rgba(211, 211, 211, 0.36)",
                            borderRadius: '1rem',
                            color: selectedType == 'Logic' ? userColor : 'white',
                            borderColor: selectedType == 'Logic' ? userColor : 'rgb(211,211,211,0.36)',
                        }}
                        onClick={() => setSelectedType('Logic')}
                    >Logic</motion.button>
                </div>
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column-reverse',
                        justifyContent: 'center'

                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: '10vh',
                            padding: '1rem',
                            gap: '2rem',
                            fontSize: '3vh',

                        }}
                    >
                        <motion.button
                            whileHover={{
                                background: "rgba(21, 21, 21, 0.58)"
                            }}
                            style={{
                                width: '100%',
                                height: '100%',
                                background: "rgba(19, 19, 19, 0.33)",
                                border: "1.5px solid rgba(211, 211, 211, 0.36)",
                                borderRadius: '1rem',
                                fontWeight: '600',
                                color: userColor,
                                opacity: selectedType.length > 0 && projectName.length > 0 ? 1 : 0,
                                cursor: selectedType.length > 0 && projectName.length > 0 ? 'pointer' : 'default',
                                transition: "opacity .3s"
                            }}
                            onClick={() => {
                                props.CreatePost(projectName, selectedType);
                                props.GetPosts().then(posts => setPosts(posts));
                                setProjectName("");
                                setSelectedType("");
                                setCreating(false);
                            }}
                        >Create</motion.button>
                        <motion.button
                            whileHover={{
                                background: "rgba(21, 21, 21, 0.58)"
                            }}
                            style={{
                                width: '100%',
                                height: '100%',
                                background: "rgba(19, 19, 19, 0.33)",
                                border: "1.5px solid rgba(211, 211, 211, 0.36)",
                                borderRadius: '1rem',
                                fontWeight: '200',
                            }}
                            onClick={() => {
                                setProjectName("");
                                setSelectedType("");
                                setCreating(false);
                            }}
                        >Discard</motion.button>
                    </div>
                </div>
            </div>
        </div>
    </>
}