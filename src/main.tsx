import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './Root.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { EntryList } from './views/EntryList.tsx'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('No root element found')

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <EntryList />,
        loader: EntryList.loader,
      },
      {
        path: 'new',
        element: <div>New</div>,
      },
    ],
  },
])

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
