import '@/styles/globals.css';
import Navbar from '@/components/Navbar/navbar';
import Footer from '@/components/Footer/footer';

export const metadata = {
  title: 'HealthyRx Pharmacy',
  description: 'Your trusted pharmacy for all your healthcare needs',
};

export default function RootLayout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}

