import type { FC } from 'react'
import { Link, A } from '@vercel/examples-ui'

const Navbar: FC<{ isDocsApp?: boolean }> = ({ isDocsApp }) =>
  isDocsApp ? (
    <ul className="inline-flex mb-4">
      <li>
        <A href="http://localhost:3000/">Home (Multi Zones)</A>
      </li>
      <li className="ml-4">
        <Link href="/">Docs</Link>
      </li>
      <li className="ml-4">
        <Link href="/about">About Docs</Link>
      </li>
    </ul>
  ) : (
    <ul className="inline-flex mb-4">
      <li>
        <Link href="/">Home</Link>
      </li>
      <li className="ml-4">
        <Link href="/about">About</Link>
      </li>
      <li className="ml-4">
        <Link href="http://app.localhost:3000/docs">Docs (Multi Zones)</Link>
      </li>
    </ul>
  )

export default Navbar
