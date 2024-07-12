"use client";

import GradientCircle from "@/app/components/GradientCircle";
import { currentUser_atom, user_type, users_atom } from "@/app/variables";
import { useAtom } from "jotai";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from 'framer-motion';

function OptionButton(props: { callback: () => void, content: string }) {
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

        }}
        whileHover={{
            background: "rgba(29,29,29,0.8)",
        }}
        onClick={props.callback}
    >{props.content}</motion.button>
}

export default function Containter(props: {
    SaveUser: (props: { userColor: string, userEmail: string, deleted: boolean, user_id: string }) => Promise<void>,
    UserId: string,
    Users: user_type[]
}) {
    const setCurrentUserId = useAtom(currentUser_atom)[1];
    const currentUserId = props.UserId;

    // atention
    if (currentUserId == null) redirect('./login');

    const users = props.Users;
    const [user, setUser] = useState<user_type | undefined>(users.find(a => a.id == currentUserId));

    const [leftSide, setLeftSide] = useState(false);

    if (user == null) redirect('./login');
    const [userColor, setuserColor] = useState(user.color);

    useEffect(() => {
        setUser(users.find(a => a.id == currentUserId));
    }, [currentUserId]);

    return <div
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
            left: leftSide ? "-125vh" : 0,
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
                }}
                content="Posts"
            />
            <OptionButton
                callback={() => {
                    setLeftSide(true);
                }}
                content="Manage Account"
            />
        </div>
        <div
            style={{
                position: 'fixed',
                left: leftSide ? '30vw' : '100vw',
                top: `${9.4}vw`,
                width: '40vw',
                aspectRatio: 1.2,
                display: 'flex',
                justifyContent: 'flex-start',
                flexDirection: 'column',
                alignItems: "center",
                background: "rgba(245, 245, 245, 0.1)",
                borderRadius: 32,
                backdropFilter: 'blur(3px)',
                transition: "left 0.3s ease-in-out",
                border: '1.5px solid rgba(253, 253, 253, 0.51)',
                padding: '3vh',

            }}
        >
            <h1
                style={{
                    fontFamily: "Poppins",
                    fontSize: "4vh",
                    fontWeight: 'bolder',

                }}
            >{currentUserId}</h1>
            <div
                style={{
                    width: '80%',
                    height: '2px',
                    marginLeft: '10%',
                    color: "red",
                    background: "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(255, 255, 255, 1), rgba(0, 0, 0, 0))",
                }}
            ></div>
            <br />
            <br />
            <div
                style={{
                    display: 'flex',
                    gap: '1vh',
                    background: "rgba(12, 12, 12, 0.2)",
                    borderRadius: '1rem',
                    padding: '.5rem',
                    border: '1.5px solid rgba(253, 253, 253, 0.51)',
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
            <motion.div
                style={{
                    display: 'flex',
                    gap: '1vh',
                    marginTop: '20vh',
                    background: "rgba(232, 92, 148, 0.2)",
                    borderRadius: '1rem',
                    padding: '.5rem',
                    border: '1.5px solid rgba(253, 253, 253, 0.51)',
                    width: '20vw',
                    height: '5vh',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    justifySelf: "flex-end",
                    color: "rgb(255, 128, 158)",
                }}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                    setCurrentUserId(null);
                    setLeftSide(false);
                    redirect('/')
                }}
            >
                <h1
                    style={{
                        fontWeight: 'bolder',
                        fontFamily: "Poppins",
                    }}

                >Log out</h1>

            </motion.div>
            <motion.div
                style={{
                    display: 'flex',
                    gap: '1vh',
                    marginTop: '1.5vh',
                    background: "rgba(255, 0, 0, 0.2)",
                    borderRadius: '1rem',
                    padding: '.5rem',
                    border: '1.5px solid rgba(253, 253, 253, 0.51)',
                    width: '20vw',
                    height: '5vh',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    justifySelf: "flex-end",
                    color: "rgb(255, 128, 128)",
                }}
                whileHover={{ scale: 1.05 }}
                onClick={() => {
                    props.SaveUser({
                        userColor: userColor,
                        userEmail: user.email,
                        user_id: user.id,
                        deleted: true,
                    });
                    setLeftSide(false);
                }}
            >
                <h1
                    style={{
                        fontWeight: 'bolder',
                        fontFamily: "Poppins",
                    }}

                >Delete user</h1>

            </motion.div>
            <div
                style={{
                    marginTop: 'auto',
                    display: 'flex',
                    gap: '2rem',
                    fontSize: '3vh',
                    fontFamily: "Poppins",
                }}
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    style={{
                        fontWeight: '500',
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
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    style={{
                        fontWeight: '200',
                    }}
                    onClick={() => setLeftSide(false)}
                >Exit</motion.button>
            </div>
        </div>
    </div>
}