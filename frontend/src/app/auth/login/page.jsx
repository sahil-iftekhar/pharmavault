'use client';

import classes from './page.module.css';
import { useActionState } from 'react';
import { LoginButton } from '@/components/button';
import { loginUser } from "@/actions/login";
import { DEFAULT_LOGIN_REDIRECT } from '@/route';
// import Image from 'next/image';

export default function loginPage () {
  const [state, formAction] = useActionState(loginUser, { errors: null });

  if (state.status === 200) {
    window.location.href = DEFAULT_LOGIN_REDIRECT;
  }

  return (
    <div>
        <h1>Login</h1>
        <form action={formAction}>
            {state.errors && <p>{state.errors}</p>}
            {/* {state.errors && (
            <ErrorAlert message={state.errors} onClose={() => {}} />
            )} */}
            <div>
            <input type="text" placeholder="EMAIL" name="email" required/>
            </div>

            <div>
            <input type="password" placeholder="PASSWORD" name='password' required/>
            </div>
            <LoginButton />
        </form>
    </div>
  );
};

