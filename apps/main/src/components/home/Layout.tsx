import Head from "next/head";
import Link from "next/link";
import React from "react";
import Footer from "./Footer";
import Header from "./Header";

import type { WithChildren } from "@types";

export default function Layout({ children } : WithChildren) {
  return (
    <>
      <div>
        <Head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        <Header />
        {children}
        <Footer />
      </div>
    </>
  );
}
