'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { useActionState } from 'react';
import { LoginButton } from '@/components/Button/button';
import { loginUser } from "@/actions/login";
import { DEFAULT_LOGIN_REDIRECT } from '@/route';

export default function loginPage () {
  const [state, formAction] = useActionState(loginUser, { errors: null });

  if (state.status === 200) {
    window.location.href = DEFAULT_LOGIN_REDIRECT;
  }

  return (
    <div>
      <div className={styles.container}>
        <form className={styles.form} action={formAction}>
          <h1>Login</h1>
          {state.errors && <p className={styles.error}>{state.errors}</p>}
          <div className={styles.formGroup}>
            <input type="text" placeholder="Email" name="email" required/>
          </div>
          
          <div className={styles.formGroup}>
            <input type="password" placeholder="Password" name='password' required/>
          </div>
          
          <LoginButton />
          
          <p className={styles.signup}>
            Don't have an account? <Link href="/auth/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

