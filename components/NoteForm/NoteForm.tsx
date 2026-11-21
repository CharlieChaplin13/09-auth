'use client'

import { useRouter } from 'next/navigation';
import { useNoteDraftStore } from '@/lib/store/noteStore'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from "@/lib/api/clientApi";
import type { CreateNote } from "@/types/note";
import toast from "react-hot-toast";
import css from './NoteForm.module.css';


export default function NoteForm () {
  const queryClient = useQueryClient();
  const router = useRouter()
  const { draft, setDraft,clearDraft } = useNoteDraftStore();

  const handleGoBack = () => {
      router.push('/notes/filter/all');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDraft({ [name]: value });
  };

  const createNoteMutation = useMutation({
    mutationFn: createNote,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] })
      clearDraft();
      toast.success("Note created successfully!")
      router.push('/notes/filter/all');
    },

    onError: () => {
      toast.error("Failed to create note.")
    },
  })

  const isPending = createNoteMutation.isPending;

  const handleSubmit = async (formData: FormData) => {
    const newNote: CreateNote = {
      title: String(formData.get('title') || ''),
      content: String(formData.get('content') || ''),
      tag: String(formData.get('tag') || 'Todo') as CreateNote['tag'],
    };

    createNoteMutation.mutate(newNote);
  };

  return(
      <form action={handleSubmit} className={css.form}>

        <div className={css.formGroup}>
          <label htmlFor='title' >Title</label>
          <input
            id='title' 
            type="text" 
            name="title"
            defaultValue={draft.title}
            onChange={handleChange}
            required
            minLength={3}
            maxLength={50} 
            className={css.input} 
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor='content'>Content</label>
          <textarea
            id='content'
            name="content"
            defaultValue={draft.content}
            onChange={handleChange}
            rows={8}
            maxLength={500}
            className={css.textarea}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor='tag'>Tag</label>
          <select 
            id='tag'
            name='tag'
            defaultValue={draft.tag}
            onChange={handleChange}
            className={css.select}
          >
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </select>
        </div>

        <div className={css.actions}>
          <button 
            type="button" 
            className={css.cancelButton}
            onClick={handleGoBack}
            disabled={isPending}
        >
            Cancel
          </button>

          <button
            type="submit"
            className={css.submitButton}
            disabled={isPending}
          >
            {isPending ? "Creating..." : "Create note"}
          </button>
        </div>

      </form>
  )
}