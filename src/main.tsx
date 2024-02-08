import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './Root.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { EntryList } from './views/EntryList.tsx'
import { EntryNew } from './views/EntryNew.tsx'
import { EntryEdit } from './views/EntryEdit.tsx'
import { EntryView } from './views/EntryView.tsx'

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
        path: 'palabras/',
        element: <EntryList />,
        loader: EntryList.loader,
      },
      {
        path: 'palabras/:id',
        element: <EntryView />,
        loader: EntryView.loader,
      },
      {
        path: 'palabras/:id/editar',
        element: <EntryEdit />,
        action: EntryEdit.action,
        loader: EntryEdit.loader,
      },
      {
        path: 'palabras/nueva',
        element: <EntryNew />,
        action: EntryNew.action,
        loader: EntryNew.loader,
      },
    ],
  },
])

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
