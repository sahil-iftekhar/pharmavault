'use client'

import { useFormStatus } from "react-dom";
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