import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Paneer typing game",
  description: "Entering Paneer into the text box wins you the game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
