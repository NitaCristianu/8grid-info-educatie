"use client";
import { CSSProperties, useState } from 'react';
import { motion } from 'framer-motion'
import { useAtom } from 'jotai';
import { currentUser_atom, users_atom } from '@/app/variables';

const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface LogInSignInProps {
    users: { id: string, email: string, password: string, color: string }[],
    createUser: (id: string, password: string, email?: string) => Promise<void>,
    logIn: (id: string) => Promise<void>,
    signUp: (id: string, password: string, email?: string) => Promise<void>
}

const inputProps: CSSProperties = {
    textAlign: 'center',
    background: 'none',
    position: 'relative',
    height: '3vh',
    fontSize: '2vh',
    outline: 'none',
}

function Card(props: {
    name: string,
    password: string,
    email: string,
    setName: (a: string) => void,
    setPassword: (b: string) => void,
    setEmail: (c: string) => void,
    proced: () => void,
    users: {
        id: string;
        email: string;
        password: string;
        color: string;
    }[],
    logging: boolean,
    alternative: () => void,
}) {
    const setCurrentUser = useAtom(currentUser_atom)[1];
    const setUsers = useAtom(users_atom)[1];
    setUsers(props.users);

    return <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            height: '60vh'
        }}
    >

        <form
            style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                padding: props.logging ? '9vh' : '7vh',
                background: 'none'
            }}
        >
            <input
                type='text'
                placeholder={props.logging ? "Enter Username" : "Enter Username"}
                style={inputProps}
                value={props.name}
                onChange={event => props.setName(event.currentTarget.value)}
            />

            <p
                style={{
                    fontFamily: "Poppins",
                    fontWeight: 'light',
                    textAlign: 'center',
                    marginTop: '1vh',
                    marginBottom: props.logging ? '3vh' : '1vh',
                    color: "rgba(247, 114, 114, 0.53)",
                    textShadow: "0px 0px 10px rgba(255,100,100,0.5)",
                    opacity: props.name.includes(' ') ? 1 : 0,
                    transition: 'opacity 0.2s ease-in-out'

                }}

            >Username must not include any spaces</p>
            {
                props.logging ? null : <><input
                    type='email'
                    style={{
                        ...inputProps,
                        marginBottom: '1vh'
                    }}
                    placeholder={"Enter Email"}
                    value={props.email}
                    onChange={event => props.setEmail(event.currentTarget.value)}

                />
                    <p
                        style={{
                            fontFamily: "Poppins",
                            fontWeight: 'light',
                            textAlign: 'center',
                            color: "rgba(247, 114, 114, 0.53)",
                            textShadow: "0px 0px 10px rgba(255,100,100,0.5)",
                            opacity: !emailRegex.test(props.email) && props.email.length > 0 ? 1 : 0,
                            transition: 'opacity 0.2s ease-in-out',
                            marginBottom: '2vh'

                        }}

                    >Email is not valid</p>
                </>

            }
            <input
                type='password'
                style={inputProps}
                placeholder={"Enter Password"}
                value={props.password}
                onChange={event => props.setPassword(event.currentTarget.value)}
            />
            <p
                style={{
                    fontFamily: "Poppins",
                    fontWeight: 'light',
                    textAlign: 'center',
                    marginTop: '1vh',
                    marginBottom: props.logging ? '5vh' : '7vh',
                    color: "rgba(247, 114, 114, 0.53)",
                    textShadow: "0px 0px 10px rgba(255,100,100,0.5)",
                    opacity: props.password.length >= 8 || props.password == "" ? 0 : 1,
                    transition: 'opacity 0.2s ease-in-out'

                }}

            >Password must have 8 characters at least</p>
        </form>
        <motion.a
            href={`/account/${props.name}`}
            style={{
                textAlign: "center",
                fontWeight: 600,
                fontSize: '3vh',
                marginBottom: '2vh',
                textShadow: "0px 0px 10px rgba(255, 255, 255, 0.15)",
                opacity: props.name.includes(' ') || props.password.length < 8 || (!props.logging && !(emailRegex.test(props.email))) ? .5 : 1,
                transition: 'opacity 0.2s ease-in-out',
                cursor: props.name.includes(' ') ? 'text' : 'pointer',

            }}
            whileHover={{
                scale: 1.05,
                textShadow: "0px 0px 15px rgba(255, 255, 255, 0.55)"
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
                if (props.name.includes(' ') || props.name == '' || props.password.length < 8) return;
                if (!props.logging) {
                    if (!emailRegex.test(props.email)) return;
                    const user = props.users.find(user => user.id == props.name || user.email == props.email);
                    if (user) return alert('username or email already in use');
                    props.proced();
                    setCurrentUser(props.name);
                    return;
                }
                const user = props.users.find(user => user.id == props.name || user.email == props.name);
                if (!user) {
                    alert(`user called '${props.name}' does not exist`);
                    return;
                }
                if (props.password != user.password) {
                    alert(`Incorrect passoword`);
                    return;
                }
                setCurrentUser(user.id);
                props.proced()
            }}

        >{props.logging ? "Log in" : "Sign Up"}</motion.a>
        <div
            style={{
                width: '80%',
                height: '2px',
                marginLeft: '10%',
                color: "red",
                background: "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(255, 255, 255, 1), rgba(0, 0, 0, 0))",
            }}
        ></div>
        <p
            style={{
                fontFamily: "Poppins",
                fontWeight: 'lighter',
                textAlign: 'center',
                marginTop: '1vh'
            }}
        >{props.logging ? "Don't have an account?" : "Already have an account?"}</p>
        <motion.button
            style={{
                textAlign: "center",
                fontWeight: 'bolder',
                fontSize: '2vh',
                marginBottom: '2rem',
                textShadow: "0px 0px 10px rgba(255, 255, 255, 0.15)",
            }}
            whileHover={{
                scale: 1.05,
                textShadow: "0px 0px 15px rgba(255, 255, 255, 0.55)"
            }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
                props.alternative()
            }}
        >{props.logging ? "Create one" : "Log in"}</motion.button>
    </div>
}

export default function LogInSignInComponent(props: LogInSignInProps) {

    const USERS = props.users;
    const [name, setName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [isLoggingIn, setIsLogginIn] = useState<boolean>(true);
    const user = USERS.find(user => user.id == name || user.email == name);

    return <><div
        style={{
            position: 'fixed',
            inset: 0,
            height: '70vh',
            width: '50vh',
            margin: 'auto',
            borderRadius: '5rem',
            backdropFilter: 'blur(3px)',
            border: "1.5px solid rgba(255, 255, 255, 0.42)",
            background: "rgba(170, 170, 170, 0.1)",
            fontFamily: 'Poppins',
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column'
        }}
    >
        <Card
            name={name}
            password={password}
            email={email}
            setName={setName}
            setPassword={setPassword}
            setEmail={setEmail}
            users={USERS}
            proced={() => {
                if (isLoggingIn) {
                    props.logIn(user ? user.id : name);
                } else {
                    props.signUp(name, password, email);
                }
            }}
            alternative={() => {
                setIsLogginIn(prev => !prev)
            }}
            logging={isLoggingIn}
        />

    </div>
    </>
}