import { cookies } from 'next/headers';
import { nextServer } from './api';
import { User } from '@/types/user';
import { Note, NoteTag} from '@/types/note'

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

// notes api

export const fetchNotes = async ({
    search = "",
    page = 1,
    perPage = 12,
    tag
  }: FetchNotesArgs = {}): Promise<Response> => {
    const cookieStore = await cookies();

    const { data } = await nextServer.get<Response>('/notes', {
      params: {
        search,
        page,
        perPage,
        tag: (tag && tag !== 'all' ? tag: undefined)
      },
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
  return data;
};

export const fetchNoteById = async (id: string) => {
  const cookieStore = await cookies();

  const { data } = await nextServer.get<Note>(`/notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

// auth & session api

export const checkSession = async () => {
  const cookieStore = await cookies();
  const res = await nextServer.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

// users api

export const getMe = async (): Promise<User> => {
  const cookieStore = await cookies();
  const { data } = await nextServer.get('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};