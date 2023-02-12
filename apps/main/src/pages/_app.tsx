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

//src/pages/_app.tsx
import type { LayoutProps } from '@vercel/examples-ui/layout'
import { getLayout } from '@vercel/examples-ui'
// import '../styles/globals.css'
import '@vercel/examples-ui/globals.css'
import { SessionProvider } from 'next-auth/react'
import type { Session } from 'next-auth'
import type { AppType } from 'next/app'

import { api } from '../lib/utils/api'

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const Layout = getLayout<LayoutProps>(Component)

  return (
    <SessionProvider session={session}>
      <Layout title="Microfrontends" path="solutions/microfrontends">
        <Component {...pageProps} />
      </Layout>
    </SessionProvider>
  )
}

export default api.withTRPC(MyApp)
