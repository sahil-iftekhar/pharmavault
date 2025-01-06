'use client';

import Link from 'next/link';
import styles from './page.module.css';
import { useActionState } from 'react';
import { SignUpButton } from '@/components/Button/button';
import { createNewUser } from "@/actions/signup";
import { DEFAULT_LOGIN_REDIRECT } from '@/route';

export default function loginPage () {
  const [state, formAction] = useActionState(createNewUser, { errors: null, error_data: null});
    
  if (state.status === 200) {
    window.location.href = DEFAULT_LOGIN_REDIRECT;
  }

  return (
      <div>
      <div className={styles.container}>
        <form className={styles.form} action={formAction}>
            <h2>Sign Up</h2>
            
            {state.errors && <p className={styles.error}>{state.errors}</p>}
            <div className={styles.formGroup}>
            <input type="text" placeholder="Email" name="email"/>
            {state.error_data && state.error_data.email && <p className={styles.error}>{state.error_data.email}</p>}
            </div>
            
            <div className={styles.formGroup}>
            <input type="text" placeholder="Name" name="name"/>
            {state.error_data && state.error_data.name && <p className={styles.error}>{state.error_data.name}</p>}
            </div>

            <div className={styles.formGroup}>
            <input type="text" placeholder="+880XXXXXXXXXX" name="phone"/>
            {state.error_data && state.error_data.phone && <p className={styles.error}>{state.error_data.phone}</p>}
            <small className={styles.small}>Phone number must contain country code.</small>
            </div>

            <div className={styles.formGroup}>
            <input type="text" placeholder="Address" name="address"/>
            {state.error_data && state.error_data.address && <p className={styles.error}>{state.error_data.address}</p>}
            </div>
            
            <div className={styles.formGroup}>
            <input type="password" placeholder="Password" name='password'/>
            {state.error_data && state.error_data.password && <p className={styles.error}>{state.error_data.password}</p>}
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
            <input type="password" placeholder="Confirm Password" name='confirm_password' />
            {state.error_data && state.error_data.confirm_password && <p className={styles.error}>{state.error_data.confirm_password}</p>}
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

