import { atom } from "jotai";

export interface user_type {
    id: string,
    password: string,
    email: string,
    color: string,
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