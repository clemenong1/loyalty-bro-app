import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

const baseUrl = process.env.EXPO_BASE_URL ?? '';

export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        <meta name="description" content="Track every loyalty membership you've signed up for, so benefits stop going to waste." />

        <link rel="manifest" href={`${baseUrl}/manifest.json`} />
        <meta name="theme-color" content="#3c87f7" />

        <link rel="icon" href={`${baseUrl}/icons/icon-192.png`} />
        <link rel="apple-touch-icon" href={`${baseUrl}/icons/icon-512.png`} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Loyalty Bro" />

        <ScrollViewStyleReset />
      </head>
      <body>
        {children}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('${baseUrl}/sw.js').catch(() => {});
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
