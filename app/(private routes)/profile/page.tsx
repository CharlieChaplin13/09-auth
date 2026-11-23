import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getMe } from '@/lib/api/serverApi';
import css from './ProfilePage.module.css'

export const metadata: Metadata = {
  title: "Profile | NoteHub",
  description: "User profile page in NoteHub",
  openGraph: {
    title: "NoteHub Profile",
      description: "The app for writing, editing, and browsing notes.",
      url: `https://09-auth-fu9k.vercel.app
`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: "NoteHub",
        },
      ],
  }
};

const Profile = async () => {
  const user = await getMe();

  return (
    <main className={css.mainContent}>
  <div className={css.profileCard}>
      <div className={css.header}>
	     <h1 className={css.formTitle}>Profile Page</h1>
	     <Link href="/profile/edit" className={css.editProfileButton}>
	       Edit Profile
	     </Link>
	   </div>
     <div className={css.avatarWrapper}>
      <Image
        src={user.avatar}
        alt="User Avatar"
        width={120}
        height={120}
        className={css.avatar}
      />
    </div>
    <div className={css.profileInfo}>
      <p>
        Username: {user.username}
      </p>
      <p>
        Email: {user.email}
      </p>
    </div>
  </div>
</main>
  );
};

export default Profile;