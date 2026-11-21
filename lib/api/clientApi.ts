import { nextServer } from './api';
import type { Note, CreateNote, NoteTag } from "@/types/note";
import type { User } from '@/types/user'

// request & response types

interface Response {
    notes: Note[]
    totalPages: number
}

interface FetchNotesArgs {
    search?: string;
    page?: number;
    perPage?: number;
    tag?: NoteTag | 'all'; 
}

export type RegisterRequest = {
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

type CheckSessionRequest = {
  success: boolean;
};

export type UpdateUserRequest = {
  username?: string;
};

// notes api

export const fetchNotes = async ({
    search = "",
    page = 1,
    perPage = 12,
    tag
  }: FetchNotesArgs = {}): Promise<Response> => {
   
    const { data } = await nextServer.get<Response>('/notes', {
        params: {
            search,
            page,
            perPage,
            tag: (tag && tag !== 'all' ? tag: undefined)
        }});
     return data;
};

export const fetchNoteById = async (id: string) => {
  const res = await nextServer.get<Note>(`/notes/${id}`);
  return res.data;
};

export const createNote = async (newNote: CreateNote): Promise<Note> => {
      const { data } = await nextServer.post<Note>('/notes', newNote);
      return data;
    };

export const deleteNote = async (noteId: string): Promise<Note> => {
      const { data } = await nextServer.delete<Note>(`/notes/${noteId}`);
      return data;
    };    

// auth & session api    

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<User>('/auth/register', data);
  return res.data;
}

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<User>('/auth/login', data);
  return res.data;
};


export const logout = async (): Promise<void> => {
  await nextServer.post('/auth/logout')
};


export const checkSession = async () => {
  const res = await nextServer.get<CheckSessionRequest>('/auth/session');
  return res.data.success;
};

//  users api

export const getMe = async () => {
  const { data } = await nextServer.get<User>('/users/me');
  return data;
};

export  const updateMe = async (payload: UpdateUserRequest) => {
  const res = await nextServer.patch<User>('/users/me', payload);
  return res.data;
};