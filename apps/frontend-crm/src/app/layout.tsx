import { Roboto } from "next/font/google";

import "@workspace/ui/globals.css";
import { AppProviders } from "@/providers";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["100", "300", "400", "500", "700"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${roboto.variable} font-sans antialiased `}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
