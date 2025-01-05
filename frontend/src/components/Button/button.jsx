'use client'

import { useFormStatus } from "react-dom";
import { useActionState } from 'react';
import { logoutUser } from "@/actions/logout";
import classes from "./button.module.css"

export function LoginButton () {
  const { pending } = useFormStatus()

  return (
    <button disabled={pending} type="submit" className={classes.button} >
      {pending ? 'Logging in...' : 'Login'}
    </button>
  );
};

export function SignUpButton () {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending} type="submit" className={classes.button} >
      {pending ? 'Signing up...' : 'Sign up'}
    </button>
  );
};

export function LogoutButton() {
  const [state, action] = useActionState(logoutUser, { errors: null });
  const { pending } = useFormStatus()

  return (
    <form action={action}>
      <button disabled={pending} type="submit" className={classes.logoutButton} >
        {pending ? 'Logging out...' : 'Logout'}
      </button>
      {state.errors && <p className="text-red-500">{state.errors}</p>}
    </form>
  );
}