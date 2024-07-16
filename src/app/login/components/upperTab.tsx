"use client";
import { motion } from 'framer-motion';
import { redirect } from 'next/navigation';

export default function ExitButton(props: {
    exit: () => void,
    saveButton?: {
        save: () => void,

    }
}) {
    return <div
        style={{
            padding: '3vh',
            width: '100%',
            justifyContent: 'center',
            display: 'flex',
            alignContent: 'center',
            zIndex: 8,
            position: 'fixed',
            top: 0,
            left: 0,
            gap: '2vw'
        }}
    >
        <motion.button
            whileHover={{
                scale: 1.05,
                opacity : 0.5,
            }}
            onClick={() => props.exit()}
        >
            <svg fill="#ffffff" width={32} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 495.398 495.398" >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
                <g id="SVGRepo_iconCarrier">
                    <g>
                        <g>
                            <g>
                                <path d="M487.083,225.514l-75.08-75.08V63.704c0-15.682-12.708-28.391-28.413-28.391c-15.669,0-28.377,12.709-28.377,28.391 v29.941L299.31,37.74c-27.639-27.624-75.694-27.575-103.27,0.05L8.312,225.514c-11.082,11.104-11.082,29.071,0,40.158 c11.087,11.101,29.089,11.101,40.172,0l187.71-187.729c6.115-6.083,16.893-6.083,22.976-0.018l187.742,187.747 c5.567,5.551,12.825,8.312,20.081,8.312c7.271,0,14.541-2.764,20.091-8.312C498.17,254.586,498.17,236.619,487.083,225.514z">
                                </path>
                                <path d="M257.561,131.836c-5.454-5.451-14.285-5.451-19.723,0L72.712,296.913c-2.607,2.606-4.085,6.164-4.085,9.877v120.401 c0,28.253,22.908,51.16,51.16,51.16h81.754v-126.61h92.299v126.61h81.755c28.251,0,51.159-22.907,51.159-51.159V306.79 c0-3.713-1.465-7.271-4.085-9.877L257.561,131.836z">
                                </path>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        </motion.button>
        {props.saveButton ? <motion.button
            whileFocus={{
                scale: 1.05
            }}
            onClick={() => props.saveButton?.save()}

        >
            <svg width={'3vh'} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M5 21H19C20.1046 21 21 20.1046 21 19V8.82843C21 8.29799 20.7893 7.78929 20.4142 7.41421L16.5858 3.58579C16.2107 3.21071 15.702 3 15.1716 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M7 3V8H15V3" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M7 21V15H17V21" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
        </motion.button> : null}
    </div >
}