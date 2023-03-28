import React from 'react'
import {Header} from './header'

type User = {
  name: string
}

export const Page: React.FC = () => {
  const [user, setUser] = React.useState<User>()

  return (
    <article>
      <Header
        user={user}
        onLogin={() => setUser({ name: 'Jane Doe' })}
        onLogout={() => setUser(undefined)}
        onCreateAccount={() => setUser({ name: 'Jane Doe' })}
      />

      <section className="font-sans text-base leading-6 px-5 py-12 mx-auto max-w-3xl text-gray-800">
        <h2 className="font-semibold text-4xl leading-none mb-1">
          Pages in Storybook
        </h2>
        <p>
          We recommend building UIs with a{' '}
          <a
            href="https://componentdriven.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
          >
            <strong>component-driven</strong>
          </a>{' '}
          process starting with atomic components and ending with pages.
        </p>
        <p>
          Render pages with mock data. This makes it easy to build and review
          page states without needing to navigate to them in your app. Here are
          some handy patterns for managing page data in Storybook:
        </p>
        <ul className="pl-8 mt-4 mb-4 list-disc">
          <li className="mb-2">
            Use a higher-level connected component. Storybook helps you compose
            such data from the "args" of child component stories
          </li>
          <li>
            Assemble data in the page component from your services. You can mock
            these services out using Storybook.
          </li>
        </ul>
        <p>
          Get a guided tutorial on component-driven development at{' '}
          <a
            href="https://storybook.js.org/tutorials/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
          >
            Storybook tutorials
          </a>
          . Read more in the{' '}
          <a
            href="https://storybook.js.org/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600"
          >
            docs
          </a>
          .
        </p>
        <div className="text-sm leading-5 mt-10 mb-10">
          <span className="inline-block bg-green-200 text-green-700 px-3 py-1 rounded-full mr-2 font-semibold">
            Tip
          </span>{' '}
          Adjust the width of the canvas with the{' '}
          <svg
            width="10"
            height="10"
            viewBox="0 0 12 12"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g fill="none" fillRule="evenodd">
              <path
                d="M1.5 5.2h4.8c.3 0 .5.2.5.4v5.1c-.1.2-.3.3-.4.3H1.4a.5.5 0 01-.5-.4V5.7c0-.3.2-.5.5-.5zm0-2.1h6.9c.3 0 .5.2.5.4v7a.5.5 0 01-1 0V4H1.5a.5.5 0 010-1zm0-2.1h9c.3 0 .5.2.5.4v9.1a.5.5 0 01-1 0V2H1.5a.5.5 0 010-1zm4.3 5.2H2V10h3.8V6.2z"
                id="a"
                fill="#999"
              />
            </g>
          </svg>
          Viewports addon in the toolbar
        </div>
      </section>
    </article>
  )
}
export default Page
