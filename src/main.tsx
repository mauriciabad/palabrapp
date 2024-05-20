import 'inter-ui/inter-variable.css'
import 'inter-ui/inter.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AdminProtected } from './AdminProtected.tsx'
import Root from './Root.tsx'
import ErrorPage from './error-page.tsx'
import './index.css'
import { AdminPage } from './views/AdminPage.tsx'
import { EditUserPage } from './views/EditUserPage.tsx'
import { EntryEdit } from './views/EntryEdit.tsx'
import { EntryList } from './views/EntryList.tsx'
import { EntryView } from './views/EntryView.tsx'
import { TermsOfService } from './views/TermsOfService.tsx'
import { EntryNew } from './views/entry-new/EntryNew.tsx'

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
      {
        path: 'admin',
        element: (
          <AdminProtected>
            <AdminPage />
          </AdminProtected>
        ),
        loader: AdminPage.loader,
      },
    ],
  },
  {
    path: 'tos',
    element: <TermsOfService />,
  },
])

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
