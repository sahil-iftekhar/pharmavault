'use client'

import { useFormStatus } from "react-dom";
import { useActionState } from 'react';
import { logoutUser } from "@/actions/logout";
import classes from "./button.module.css";

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

export function AddMedicineButton () {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending} type="submit" className={classes.button} >
      {pending ? 'Adding medicine...' : 'Add Medicine'}
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

export function AddToCartButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit" className={classes.addToCart} >
      {pending ? 'Adding to cart...' : 'Add to cart'}
    </button>
  );
};

export function ViewDetailsButton() {
  return (
    <button type="submit" className={classes.addToCart} >
      View Details
    </button>
  );
};

export function NewMedicineButton() {
  return (
    <button type="submit" className={classes.acceptButton} >
      New Medicine
    </button>
  );
};

export function UpdateMedicineButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit" className={classes.acceptButton} >
      {pending ? 'Updating medicine...' : 'Update Medicine'}    
    </button>
  );
};

export function DeleteMedicineButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit" className={classes.cancelButton} >
      {pending ? 'Deleting medicine...' : 'Delete Medicine'}    
    </button>
  );
}

export function SaveCartButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit" className={classes.button} >
      {pending ? 'Saving cart...' : 'Save Cart'}
    </button>
  );
};

export function CancelOrderButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit" className={classes.cancelButton} >
      {pending ? 'Cancelling order...' : 'Cancel Order'}
    </button>
  );
};

export function AcceptOrderButton() {
  const { pending } = useFormStatus();

  return (
    <button disabled={pending} type="submit" className={classes.acceptButton} >
      {pending ? 'Accepting order...' : 'Accept Order'}
    </button>
  );
};

export function RejectOrderButton() {
  const { pending } = useFormStatus();

  return (  
    <button disabled={pending} type="submit" className={classes.rejectButton} >
      {pending ? 'Rejecting order...' : 'Reject Order'}
    </button>
  );
};

export function DeliveredOrderButton() {
  const { pending } = useFormStatus();

  return (  
    <button disabled={pending} type="submit" className={classes.acceptButton} >
      {pending ? 'Delivering order...' : 'Deliver Order'}
    </button>
  );
}