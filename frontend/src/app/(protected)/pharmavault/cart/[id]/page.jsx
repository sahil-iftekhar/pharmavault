import { getAccessToken } from '../../../utils/auth';
import CartItems from '../../../components/CartItems';
import styles from './cart.module.css';

async function getCartItems(userId, accessToken) {
  const res = await fetch(`${process.env.API_URL}/cart/${userId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
  });
  if (!res.ok) throw new Error('Failed to fetch cart items');
  return res.json();
}

export default async function Cart({ params }) {
  const { userId } = params;
  const accessToken = getAccessToken();
  const cartItems = await getCartItems(userId, accessToken);

  return (
    <div className={styles.container}>
      <h1>Shopping Cart</h1>
      <CartItems items={cartItems} />
    </div>
  );
}

