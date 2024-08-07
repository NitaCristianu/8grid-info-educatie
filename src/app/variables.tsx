import { atom } from "jotai";

// common variables for typescript and data handling

export interface user_type {
    id: string,
    password: string,
    email: string,
    color: string,
    age : number
};
export interface post_type {
    id: string,
    userId: string,
    title: string,
    content: string,
    type: string,
    likes: string[],
    description : string,
    comments: string[],
}


export const currentUser_atom = atom<string | null>(null);
export const users_atom = atom<user_type[]>([]);