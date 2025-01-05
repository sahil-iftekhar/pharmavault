'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { useActionState } from 'react';
import { SignUpButton } from '@/components/Button/button';
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
            <h2>Sign Up</h2>
            
            {state.errors && <p>{state.errors}</p>}
            {/* {state.errors && (
            <ErrorAlert message={state.errors} onClose={() => {}} />
            )} */}
            <div className={styles.formGroup}>
            <input type="text" placeholder="Email" name="email" required/>
            </div>
            
            <div className={styles.formGroup}>
            <input type="text" placeholder="Name" name="name" required/>
            </div>

            <div className={styles.formGroup}>
            <input type="text" placeholder="+880XXXXXXXXXX" name="name" required/>
            <small className={styles.small}>Phone number must contain country code.</small>
            </div>

            <div className={styles.formGroup}>
            <input type="text" placeholder="Address" name="address" required/>
            </div>
            
            <div className={styles.formGroup}>
            <input type="password" placeholder="Password" name='password' required/>
            <small className={styles.small}>
                Password must be at least 8 characters.
                <span className={styles.line}>Must include at least 
                    one uppercase letter, 
                    one lowercase letter, 
                    one number, 
                    one special character. 
                </span>
            </small>
            </div>
            
            <div className={styles.formGroup}>
            <input type="password" placeholder="Confirm Password" name='password' required/>
            </div>
            
            <SignUpButton />
            
            <p className={styles.login}>
            Already have an account? <Link href="/auth/login">Login</Link>
            </p>
        </form>
      </div>
    </div>
  );
};

