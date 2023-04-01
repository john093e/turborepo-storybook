import type { FC } from 'react'
import { Link, A } from '@vercel/examples-ui'

const Navbar: FC<{ isDocsApp?: boolean }> = ({ isDocsApp }) => (
    <ul className="inline-flex mb-4">
      <li>
        <Link href="/">Home</Link>
      </li>
      <li className="ml-4">
        <Link href="/about">About</Link>
      </li>
    </ul>
  )

export default Navbar
