'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { updateMe } from '@/lib/api/clientApi';
import { useAuthStore } from '@/lib/store/authStore';
import css from './EditProfilePage.module.css'

const EditProfilePage = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user)
  const setUser = useAuthStore((state) => state.setUser);
  const [username, setUsername] = useState('')

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleSaveUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const updatedUser = await updateMe({ username });
    setUser(updatedUser);
    router.push('/profile')
  };

  const handleCancel = () => {
    router.push('/profile');
  };

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>
        {user?.avatar && (
          <Image 
            src={user.avatar}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        )}
    
        <form onSubmit={handleSaveUser} className={css.profileInfo}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input 
              id="username"
              type="text"
              value={username}
              onChange={handleChange}
              className={css.input}
            />
          </div>
    
          <p>Email: {user?.email}</p>
    
          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button 
              type="button"
              onClick={handleCancel} 
              className={css.cancelButton}>
                Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}

export default EditProfilePage;