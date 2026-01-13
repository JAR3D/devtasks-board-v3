import StyledComponentsRegistry from './registry';
import Providers from './providers';

import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'DevTasks Board',
  description: 'DevTasks Board',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <Providers>{children}</Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
