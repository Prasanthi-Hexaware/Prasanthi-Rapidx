import React, { lazy } from 'react'
import Loadable from 'app/components/Loadable/Loadable'

const UsersList = Loadable(lazy(() => import('./UsersList')))
const EditUsers = Loadable(lazy(() => import('./EditUsers')))
const AddUsers = Loadable(lazy(() => import('./AddUsers')))

const usersRoutes = [
    {
        path: '/users',
        element: <UsersList />,
    },
    {
        path: '/users/edit/:id',
        element: <EditUsers />,
    },
    {
        path: '/users/add',
        element: <AddUsers />,
    },
]

export default usersRoutes
