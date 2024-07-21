"use client";
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { originalData } from '../[id]/components/explorer-client-post';
import GradientCircle from '@/app/components/GradientCircle';
import { element } from 'three/examples/jsm/nodes/Nodes.js';
import { useRouter } from 'next/router';

type types = 'Math' | 'Logic';
const MATH_COLOR = ""
export default function ExplorerClient(props: {}) {
    const [currentTab, setTab] = useState("Math");
    const color = currentTab == "Math" ? "rgb(35, 137, 209)" : "rgb(248, 117, 29)";

    const [isOpenSearch, setIsOpenSearch] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [posts, setPosts] = useState<originalData[]>([]);

    useEffect(() => {
        fetch('/api/post', {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'GET',
        })
            .then((response) => response.json())
            .then((d) => {
                setPosts(d);
            })
            .catch((error) => console.log('error', error));
    }, []);

    return <div
        style={{
            width: '80vw',
            height: "80vh",
            marginLeft: '10vw',
            marginTop: '10vh',
        }}
    >
        <GradientCircle
            x={-0.54}
            y={-1.4}
            color={"rgba(117, 232, 180, 0.48)"}
            opacity={0.4}
            size={1.4}
        />
        <GradientCircle
            x={0.14}
            y={-1.0}
            color={"rgba(178, 216, 64, 0.48)"}
            opacity={0.4}
            size={1.4}
        />
        <GradientCircle
            x={0.14}
            y={-0.1}
            color={"rgba(64, 216, 79, 0.48)"}
            opacity={0.4}
            size={1.4}
        />
        <GradientCircle
            x={-0.34}
            y={-0.5}
            color={"rgba(117, 230, 232, 0.48)"}
            opacity={0.4}
            size={1}
        />
        <GradientCircle
            x={-0.34}
            y={-0.1}
            color={"rgba(203, 117, 232, 0.48)"}
            opacity={0.4}
            size={1}
        />
        <GradientCircle
            x={-0.34}
            y={-1.2}
            color={color}
            opacity={.6}
            size={1.8}
        />
        <div
            style={{
                marginLeft: '5%',
                width: '90%',
                height: '8vh',
                display: 'flex',
                gap: '4vw',
                padding: '1rem'
            }}
        >
            {['Math', 'Logic'].map(element => <div
                style={{
                    height: '100%',
                    width: '7vw',
                    fontFamily: "Poppins",
                    justifyContent: 'center',
                    display: 'flex',
                    fontSize: '3vh',
                    alignItems: 'center',
                    flexDirection: 'column',
                }}
            >
                <motion.button
                    style={{
                        fontWeight: 600,
                        userSelect: 'none'
                    }}
                    onClick={() => setTab(element)}

                >{element}</motion.button>
                <motion.div
                    animate={{
                        background: currentTab == element ? color : 'white',
                        width: currentTab == element ? '100%' : '3%',
                    }}
                    style={{
                        height: '3px',

                        boxShadow: "0px 0px 15px " + color,
                        transition: 'background .3s ease-in-out',
                        borderRadius: '9px'
                    }}
                />
            </div>)}
            <motion.div
                whileHover={{
                    background: 'rgba(10, 10, 10, .35)',
                    border: '1.5px solid rgba(229, 229, 229, 0.38)',
                }}
                style={{
                    width: '33vw',
                    background: 'rgba(10, 10, 10, .15)',
                    border: '1.5px solid rgba(229, 229, 229, 0.18)',
                    height: '100%',
                    transition: 'width 0.5s ease-in-out',
                    borderRadius: '5000rem',
                    zIndex: 2,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1vh'
                }}

            >
                <svg
                    height={'3.5vh'}
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                        <path
                            fill={'#ffffff'}
                            fillRule="evenodd"
                            d="M4 9a5 5 0 1110 0A5 5 0 014 9zm5-7a7 7 0 104.2 12.6.999.999 0 00.093.107l3 3a1 1 0 001.414-1.414l-3-3a.999.999 0 00-.107-.093A7 7 0 009 2z"
                        ></path>
                    </g>
                </svg>
                <input
                    type='text'
                    style={{
                        background: 'none',
                        outline: 'none',
                        width: '100%',
                        marginLeft: '1,vw',
                        height: '100%',
                        fontFamily: "Poppins",
                        fontSize: '2vh'
                    }}
                    onChange={event => setSearchInput(event.target.value)}
                    value={searchInput}
                    placeholder='Start searching'
                />
            </motion.div>
        </div>
        <div
            style={{
                marginTop: '3vh',
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '2rem',
                columnGap: "2rem",
                rowGap: "2rem"
            }}
        >
            {searchInput[0] == "@" ? posts.filter(post => post.type == currentTab && post.userId?.toLowerCase().includes(searchInput.slice(1, searchInput.length)) && post.Public).map(post =>
                <motion.a
                    href={`/explorer/${post.id}`}
                    key={post.id}
                    whileHover={{
                        
                        border: "3.5px solid rgba(224, 224, 224, 0.69)",
                    }}
                    style={{
                        width: '20vw',
                        height: '20vh',
                        border: "1.5px solid rgba(224, 224, 224, 0.29)",
                        borderRadius: '2rem',
                        background: "rgba(0, 0, 0, 0.16)",
                        padding: '1.2rem',
                        fontFamily: "Poppins",
                        backdropFilter: 'blur(1px)'
                    }}
                >
                    <h1
                        style={{
                            fontSize: '3vh',
                            fontWeight: 600,
                            color: color,
                            textShadow: `0px 0px 20px ${color}`,
                            userSelect: 'none'
                        }}
                    >{post.title}</h1>
                    <p
                        style={{
                            wordWrap: 'normal',
                            userSelect: 'none',
                            fontWeight: 200
                        }}
                    >{post.Description}</p>
                    <div
                        style={{
                            alignSelf: 'flex-end',
                            marginTop: 'auto',
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '0.5vw',

                        }}
                    >
                        <h1
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: 600,
                                userSelect: 'none',
                            }}
                        >{Array.from(new Set(post.likes)).length || 0}</h1>
                        <svg
                            viewBox="0 0 24 24"
                            width={'1.5rem'}
                            fill="none"
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
                                    d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
                                    fill={'white'}
                                ></path>
                            </g>
                        </svg>
                    </div>


                </motion.a>)
                :
                posts.filter(post => post.type == currentTab && post.title.toLowerCase().includes(searchInput) && post.Public).map(post => <motion.a
                    href={`/explorer/${post.id}`}
                    key={post.id}
                    whileHover={{
                        border: "3.5px solid rgba(224, 224, 224, 0.69)",
                    }}
                    style={{
                        width: '20vw',
                        height: '20vh',
                        border: "1.5px solid rgba(224, 224, 224, 0.29)",
                        borderRadius: '2rem',
                        background: "rgba(0, 0, 0, 0.16)",
                        padding: '1.2rem',
                        fontFamily: "Poppins",
                        backdropFilter: 'blur(1px)'
                    }}
                >
                    <h1
                        style={{
                            fontSize: '3vh',
                            fontWeight: 600,
                            color: color,
                            textShadow: `0px 0px 20px ${color}`,
                            userSelect: 'none'
                        }}
                    >{post.title}</h1>
                    <p
                        style={{
                            wordWrap: 'normal',
                            userSelect: 'none',
                            fontWeight: 200
                        }}
                    >{post.Description}</p>
                    <div
                        style={{
                            alignSelf: 'flex-end',
                            marginTop: 'auto',
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '0.5vw',

                        }}
                    >
                        <h1
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: 600,
                                userSelect: 'none',
                            }}
                        >{Array.from(new Set(post.likes)).length || 0}</h1>
                        <svg
                            viewBox="0 0 24 24"
                            width={'1.5rem'}
                            fill="none"
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
                                    d="M2 9.1371C2 14 6.01943 16.5914 8.96173 18.9109C10 19.7294 11 20.5 12 20.5C13 20.5 14 19.7294 15.0383 18.9109C17.9806 16.5914 22 14 22 9.1371C22 4.27416 16.4998 0.825464 12 5.50063C7.50016 0.825464 2 4.27416 2 9.1371Z"
                                    fill={'white'}
                                ></path>
                            </g>
                        </svg>
                    </div>

                </motion.a>)}
        </div>
    </div>
}