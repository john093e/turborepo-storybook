import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import Loader from "./Loader";
import useRequireAuth from "@lib/useRequireAuth";
import toast from "react-hot-toast";

import type { WithChildren } from "@types";

import Header from "@components/app/common/header/Header";
interface LayoutProps extends WithChildren {
  siteId?: string;
}
import { AppLoggedInContext } from "@contexts/AppLoggedInContext";
import { AppLoggedInContextType } from "@types/appLoggedInContext";

export default function Layout({ siteId, children }: LayoutProps) {
  const title = "Administration | T-WOL";
  const description = "Prend le controle du monde digital.";
  const logo = "/favicon.ico";
  // Path
  const router = useRouter();
  const sitePage = router.pathname.startsWith("/app/site/[id]");
  const postPage = router.pathname.startsWith("/app/post/[id]");
  const websitePage = router.pathname.startsWith("/app/website");

  //for the root page
  const rootPage = !sitePage && !postPage;

  //get last part of the path for tabulation link
  const tab = rootPage
    ? router.asPath.split("/")[1]
    : websitePage
    ? router.asPath.split("/")[2]
    : router.asPath.split("/")[3];

  const { 
    error,
    user, 
    setError, 
    setUserFunction, 
    useRootModal,
    modalContent,
    useRootDrawer,
    drawerContent } = useContext(
    AppLoggedInContext
  ) as AppLoggedInContextType;

  useEffect(() => {
    if (error !== null) {
      toast.error(error);
      setError(null);
    }
  }, [error, setError]);

  const session = useRequireAuth();

  useEffect(() => {
    if (session) {
      if (user.email !== null) {
      } else {
        const userId = session.user.id as string;
        setUserFunction(userId);
        return;
      }
    }
  }, [user, setUserFunction, session]);

  if (!session) return <Loader />;

  return (
    <>
      <div>
        <Head>
          <title>{title}</title>
          <link rel="icon" href={logo} />
          <link rel="shortcut icon" type="image/x-icon" href={logo} />
          <link rel="apple-touch-icon" sizes="180x180" href={logo} />
          <meta name="theme-color" content="#7b46f6" />

          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />

          <meta itemProp="name" content={title} />
          <meta itemProp="description" content={description} />
          <meta itemProp="image" content={logo} />
          <meta name="description" content={description} />
          <meta property="og:title" content={title} />
          <meta property="og:description" content={description} />
          <meta property="og:image" content={logo} />
          <meta property="og:type" content="website" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@T-WOL" />
          <meta name="twitter:creator" content="@JohnEmmerechts" />
          <meta name="twitter:title" content={title} />
          <meta name="twitter:description" content={description} />
          <meta name="twitter:image" content={logo} />
        </Head>

        <Header />

        {websitePage && (
          <div className="absolute left-0 right-0 top-16 flex justify-center items-center font-cal space-x-16 border-b bg-white border-gray-200">
            <Link
              href="/"
              passHref
              className={`border-b-2 ${
                tab == "" ? "border-black" : "border-transparent"
              } py-3`}
            >
              My Sites
            </Link>
            <Link
              href="/settings"
              passHref
              className={`border-b-2 ${
                tab == "settings" ? "border-black" : "border-transparent"
              } py-3`}
            >
              Settings
            </Link>
          </div>
        )}
        {sitePage && (
          <div className="absolute left-0 right-0 top-16 font-cal border-b bg-white border-gray-200">
            <div className="flex justify-between items-center space-x-16 max-w-screen-xl mx-auto px-10 sm:px-20">
              <Link href="/" passHref>
                ←<p className="md:inline-block ml-3 hidden">All Sites</p>
              </Link>
              <div className="flex justify-between items-center space-x-10 md:space-x-16">
                <Link
                  href={`/site/${router.query.id}`}
                  passHref
                  className={`border-b-2 ${
                    !tab ? "border-black" : "border-transparent"
                  } py-3`}
                >
                  Posts
                </Link>
                <Link
                  href={`/site/${router.query.id}/drafts`}
                  passHref
                  className={`border-b-2 ${
                    tab == "drafts" ? "border-black" : "border-transparent"
                  } py-3`}
                >
                  Drafts
                </Link>
                <Link
                  href={`/site/${router.query.id}/settings`}
                  passHref
                  className={`border-b-2 ${
                    tab == "settings" ? "border-black" : "border-transparent"
                  } py-3`}
                >
                  Settings
                </Link>
              </div>
              <div />
            </div>
          </div>
        )}
        {postPage && (
          <div className="absolute left-0 right-0 top-16 font-cal border-b bg-white border-gray-200">
            <div className="flex justify-between items-center space-x-16 max-w-screen-xl mx-auto px-10 sm:px-20">
              {siteId ? (
                <Link href={`/site/${siteId}`} passHref>
                  ←<p className="md:inline-block ml-3 hidden">All Posts</p>
                </Link>
              ) : (
                <div>
                  {" "}
                  ←<p className="md:inline-block ml-3 hidden">All Posts</p>
                </div>
              )}

              <div className="flex justify-between items-center space-x-10 md:space-x-16">
                <Link
                  href={`/post/${router.query.id}`}
                  passHref
                  className={`border-b-2 ${
                    !tab ? "border-black" : "border-transparent"
                  } py-3`}
                >
                  Editor
                </Link>
                <Link
                  href={`/post/${router.query.id}/settings`}
                  passHref
                  className={`border-b-2 ${
                    tab == "settings" ? "border-black" : "border-transparent"
                  } py-3`}
                >
                  Settings
                </Link>
              </div>
              <div />
            </div>
          </div>
        )}
        <div className="pt-[3.8rem] flex">{children}</div>
        {/* Root Modal panel */}
        {useRootModal && (
          modalContent
        )}
        {/* Root Drawer panel */}
        {useRootDrawer && (
          drawerContent
        )}
      </div>
    </>
  );
}
