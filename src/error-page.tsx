import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
  const error = useRouteError()
  console.error(error)

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        {/* @ts-expect-error Property 'statusText' does not exist on type '{}'.ts(2339) */}
        <i>{error?.statusText || error?.message || error}</i>
      </p>
    </div>
  )
}
