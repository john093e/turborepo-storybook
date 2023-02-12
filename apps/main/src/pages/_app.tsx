// import type { AppProps } from 'next/app'
// import type { LayoutProps } from '@vercel/examples-ui/layout'
// import { getLayout } from '@vercel/examples-ui'
// import '@vercel/examples-ui/globals.css'

// export default function MyApp({ Component, pageProps }: AppProps) {
//   const Layout = getLayout<LayoutProps>(Component)

//   return (
//     <Layout title="Microfrontends" path="solutions/microfrontends">
//       <Component {...pageProps} />
//     </Layout>
//   )
// }









// //src/pages/_app.tsx
// import type { LayoutProps } from '@vercel/examples-ui/layout'
// import { getLayout } from '@vercel/examples-ui'
// // import '../styles/globals.css'
// import '@vercel/examples-ui/globals.css'
// import { SessionProvider } from 'next-auth/react'
// import type { Session } from 'next-auth'
// import type { AppType } from 'next/app'

// import { api } from '../lib/utils/api'

// const MyApp: AppType<{ session: Session | null }> = ({
//   Component,
//   pageProps: { session, ...pageProps },
// }) => {
//   const Layout = getLayout<LayoutProps>(Component)

//   return (
//     <SessionProvider session={session}>
//       <Layout title="Microfrontends" path="solutions/microfrontends">
//         <Component {...pageProps} />
//       </Layout>
//     </SessionProvider>
//   )
// }

// export default api.withTRPC(MyApp)






//src/pages/_app.tsx
import PlausibleProvider from 'next-plausible'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'
import { Flowbite } from 'flowbite-react'
import { AppLoggedInProvider } from '@contexts/AppLoggedInContext'

import '@styles/globals.css'

import type { AppProps, AppType } from 'next/app'
import type { NextPage } from 'next'

import type { ReactElement, ReactNode } from 'react'

import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
import '@vercel/examples-ui/globals.css'
import { api } from '../lib/utils/api'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getNestedLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps<{ session: Session }> & {
  Component: NextPageWithLayout
}

const App = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  // Use the layout defined at the page level, if available
  const getNestedLayout = Component.getNestedLayout ?? ((page) => page)
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <PlausibleProvider domain="t-wol.ccom">
      <SessionProvider session={session}>
        <AppLoggedInProvider>
          <Flowbite>
            {getNestedLayout(
              <Layout title="Microfrontends" path="solutions/microfrontends">
                <Component {...pageProps} />
              </Layout>
            )}
          </Flowbite>
        </AppLoggedInProvider>
      </SessionProvider>
    </PlausibleProvider>
  )
}

export default api.withTRPC(App)
