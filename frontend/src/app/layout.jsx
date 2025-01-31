import '@/styles/globals.css';

export const metadata = {
  title: 'HealthyRx Pharmacy',
  description: 'Your trusted pharmacy for all your healthcare needs',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}

