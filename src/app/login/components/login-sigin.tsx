"use client";
import { CSSProperties, useEffect, useState } from 'react';
import { motion } from 'framer-motion'
import { useAtom } from 'jotai';
import { currentUser_atom, user_type, users_atom } from '@/app/variables';

const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export interface LogInSignInProps {
    logIn: (id: string) => Promise<void>,
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
    age: number,
    setName: (a: string) => void,
    setPassword: (b: string) => void,
    setEmail: (c: string) => void,
    setAge: (c: number) => void,
    proced: () => void,
    logging: boolean,
    alternative: () => void,
}) {
    const setCurrentUser = useAtom(currentUser_atom)[1];
    const [users, setUsers] = useState<user_type[]>([]);
    const [action, setAction] = useState(false);

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
            })
            .catch((error) => console.log('error', error));
    }, [action]);

    return <div
        style={{
            display: 'flex',
            flexDirection: 'column',
            height: '60vh',
        }}
    >

        <form
            style={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
                padding: props.logging ? '4.5vw' : '3.5vw',
                background: 'none',
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
                            marginBottom: '1vh'

                        }}

                    >Email is not valid</p>
                </>

            }
            {
                props.logging ? null : <>
                    <p
                        style={{
                            fontFamily: "Poppins",
                            fontWeight: 'light',
                            textAlign: 'center',
                            marginTop: '1vh',
                            color: "rgba(114, 165, 247, 0.53)",
                            textShadow: "0px 0px 10px rgba(100, 154, 255, 0.5)",
                            transition: 'opacity 0.2s ease-in-out',
                            fontSize: '2vh'
                        }}
                    >
                        Age : {props.age}
                    </p>
                    <input
                        type='range'
                        min={1}
                        max={100}

                        style={{
                            ...inputProps,
                            marginBottom: '3vh',
                        }}
                        placeholder={"Enter Email"}
                        value={props.age}
                        onChange={event => props.setAge(Number(event.currentTarget.value))}
                    />
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
                    marginBottom: props.logging ? '14vh' : '1vh',
                    color: "rgba(247, 114, 114, 0.53)",
                    textShadow: "0px 0px 10px rgba(255,100,100,0.5)",
                    opacity: props.password.length >= 8 || props.password == "" ? 0 : 1,
                    transition: 'opacity 0.2s ease-in-out'

                }}

            >Password must have 8 characters at least</p>
        </form>
        <motion.a
            href={!(props.name.includes(' ') || props.name == '' || props.password.length < 8) &&
                ((!props.logging && emailRegex.test(props.email) && !users.find(user => user.id == props.name)) ||
                    (props.logging && users.find(user => user.id == props.name && user.password == props.password))) ?
                `/account/${props.name}` : '/login'}
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
                setAction(prev => !prev);
                if (!props.logging) {
                    if (!emailRegex.test(props.email)) return;
                    const user = users.find(user => user.id == props.name || user.email == props.email);
                    if (user) return alert('username or email already in use');
                    props.proced();
                    setCurrentUser(props.name);
                    return;
                }
                const user = users.find(user => user.id == props.name || user.email == props.name);
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

    const [name, setName] = useState<string>("");
    const [age, setAge] = useState(18);
    const [password, setPassword] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [isLoggingIn, setIsLogginIn] = useState<boolean>(true);

    return <><div
        style={{
            position: 'fixed',
            inset: 0,
            height: '70vh',
            width: '50vh',
            margin: 'auto',
            borderRadius: '5rem',
            backdropFilter: 'blur(10px)',
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
            age={age}
            setAge={setAge}
            proced={() => {
                if (isLoggingIn) {
                    props.logIn(name);
                } else {
                    fetch('/api/user', {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
                        body: JSON.stringify({ id: name, email: email, password: password, age: age }),
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (typeof (window != undefined)) {
                                window.localStorage.setItem("userId", name);
                            }
                        })
                        .catch((error) => console.log('error', error));

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