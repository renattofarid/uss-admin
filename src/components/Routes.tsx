import { useContext, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthContext } from '@/context/AuthContext'
import { Login, Posts } from '@/pages'
import { SpinnerSplash } from './SpinnerSplash'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PostProvider } from '@/pages/Posts/context/PostContext'
import UsersPage from '@/pages/Users'
import HomePosts from '@/pages/Home'
import AuthoritiesPage from '@/pages/Authorities'
import { Role, User } from '@/services/users'
import SchoolsPage from '@/pages/Schools'

const routes = [
  {
    path: 'usuarios',
    label: 'Usuarios',
    redirectTo: '/usuarios',
    hasAccess: (user: User) => user.role === Role.ADMIN,
    component: UsersPage,
  },
  {
    path: 'home',
    label: 'Home Posts',
    redirectTo: '/home',
    hasAccess: (user: User) => user.role === Role.ADMIN,
    component: HomePosts,
  },
  {
    path: 'autoridades',
    label: 'Autoridades',
    redirectTo: '/autoridades',
    hasAccess: (user: User) => user.role === Role.ADMIN,
    component: AuthoritiesPage,
  },
  {
    path: 'escuelas',
    label: 'Escuelas',
    redirectTo: '/escuelas',
    hasAccess: (user: User) => user.role === Role.ADMIN,
    component: SchoolsPage,
  },

]

export const RoutesApp = () => {
  const { authenticate, isAuthenticating, user } = useContext(AuthContext)

  useEffect(() => {
    authenticate()
  }, []);

  if (isAuthenticating) return <SpinnerSplash />

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        {!!user && (<Route path='/' element={<DashboardLayout />}>

          <>
            <Route index element={
              <PostProvider>
                <Posts />
              </PostProvider>
            } />
            <Route path="posts" element={
              <PostProvider>
                <Posts />
              </PostProvider>
            } />
            {routes.map((route, index) => {
              if (!route.hasAccess(user!)) return null;
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <route.component />
                  }
                />
              )
            })}
          </>
        </Route>
        )}
        <Route path="*" element={<Navigate to={!!user ? '/' : '/login'} />} />
      </Routes>
    </BrowserRouter>
  )
}
