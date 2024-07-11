import { atom } from "jotai";

export interface user_type {
    id: string,
    password: string,
    email: string,
    color : string,
};

export const currentUser_atom = atom<string | null>(null);
export const users_atom = atom<user_type[]>([]);