"use client"

import Footer from "../components/Footer";


export default function Default() {
  return (
    <footer
      key={Math.random()}
      className={`flex w-full flex-col justify-end`}
    >
        <Footer />
    </footer>
  );
}