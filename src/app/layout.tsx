import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { Flip, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "Milliontree",
  description: "Generated by Milliontree",
};

const inter = Roboto({ subsets: ["latin"], weight: ["100", "300", "400", "500", "700", "900"] });

export default function RootLayout({
  header,
  footer,
  children,
}: Readonly<{
  children: React.ReactNode;
  header: React.ReactNode;
  footer: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} flex h-dvh flex-col item-center overflow-auto custom-scrollbar`}
      >
         <div className="flex w-full h-full flex-col max-w-[1440px] mx-auto">
            {header}
            <div className="flex w-full flex-1 flex-col">
              {children}
              {footer}
            </div>
          </div>
          <ToastContainer position="top-right" transition={Flip} />
      </body>
    </html>
  );
}
