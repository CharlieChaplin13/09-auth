"use client"

import { useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import Link from 'next/link';
import { fetchNotes } from '@/lib/api'
import type { NoteTag } from '@/types/note';
import SearchBox from '@/components/SearchBox/SearchBox'
import NoteList from '@/components/NoteList/NoteList'
import Pagination from '@/components/Pagination/Pagination';
import Loader from '@/components/Loader/Loader';
import EmptyState from '@/components/EmptyState/EmptyState';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage';

import css from "./Notes.client.module.css";

interface NotesClientProps {
  tag: string;
}

export default function App({tag}: NotesClientProps) {

  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentPage = Number(searchParams.get('page')) || 1;

  const updatePage = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const updateSearchQuery = useDebouncedCallback((value: string) => {
  setSearchQuery(value);
  updatePage(1);
}, 300);

  const { data, isSuccess, isLoading, error, isError, isFetching } = useQuery({
    queryKey: [ 'notes', searchQuery, currentPage, tag],
    queryFn: () => fetchNotes({
      search: searchQuery, 
      page: currentPage, 
      tag: tag as NoteTag | 'all'
    }),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  });

  const handleSearchChange = (value: string) => {
    setSearchInput(value)
    updateSearchQuery(value)
  }

  const notesList = data?.notes ?? []
  const totalPages = data?.totalPages ?? 0;


  return (
    <div className={css.app}>
	    <header className={css.toolbar}>
		    <SearchBox value={searchInput} onSearch={handleSearchChange}/>
		    {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          updatePage={updatePage}
        />
        )}
		    <Link 
          href={'/notes/action/create'} 
          className={css.button}>
            Create note +
        </Link>
      </header>
      <main className={css.mainContent}>
        {isLoading && !isError && <Loader variant={'global'}/>}

        {isSuccess && notesList.length > 0 && (
          <div className={css.listWrapper}>
            < NoteList notes={notesList}/> 
            {isFetching && !isLoading && <Loader variant={'fetching'}/>}
          </div> 
        )}

        {isError && <ErrorMessage message={error instanceof Error ? error.message : "Failed to load notes."}/>}
        {isSuccess && notesList.length === 0 && (<EmptyState searchQuery={searchQuery} onAction={() => router.push('/notes/action/create')}/>)}
      </main>
    </div>
  );
}