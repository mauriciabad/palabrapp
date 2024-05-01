import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Root from './Root.tsx'
import './index.css'
import { EntryEdit } from './views/EntryEdit.tsx'
import { EntryList } from './views/EntryList.tsx'
import { EntryView } from './views/EntryView.tsx'
import { EntryNew } from './views/entry-new/EntryNew.tsx'
import ErrorPage from './error-page.tsx'
import 'inter-ui/inter.css'
import 'inter-ui/inter-variable.css'
import { EditUserPage } from './views/EditUserPage.tsx'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('No root element found')

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
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
      {
        path: 'usuario/editar',
        element: <EditUserPage />,
      },
    ],
  },
])

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
