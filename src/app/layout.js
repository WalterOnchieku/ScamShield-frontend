/*
 * ScamShield KE — Root Layout
 * Purpose: Provide shared HTML structure and metadata for
 * every page in the application.
 */

import "./globals.css";

export const metadata = {
  title: "ScamShield KE | Verify Before You Trust",
  description:
    "Screen suspicious messages and offers for potential scam indicators. " +
    "Get AI-assisted analysis and practical safety recommendations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}