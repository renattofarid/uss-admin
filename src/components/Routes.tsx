import { useContext, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthContext } from '@/context/AuthContext'
import { Login, Posts } from '@/pages'
import { SpinnerSplash } from './SpinnerSplash'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PostProvider } from '@/pages/Posts/context/PostContext'
import { UserProvider } from '@/pages/Users/context/UserContext'
import UsersPage from '@/pages/Users'
import HomePosts from '@/pages/Home'
import AuthoritiesPage from '@/pages/Authorities'


export const RoutesApp = () => {
  const { authenticate, isAuthenticating, user } = useContext(AuthContext)

  useEffect(() => {
    console.log('RoutesApp -> authenticate', authenticate)
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
            <Route path="usuarios" element={
              <UserProvider>
                <UsersPage />
              </UserProvider>
            } />
            <Route path="home" element={
              <HomePosts />
            } />
            <Route path="autoridades" element={
              <AuthoritiesPage />
            } />
          </>
        </Route>
        )}
        <Route path="*" element={<Navigate to={!!user ? '/' : '/login'} />} />
      </Routes>
    </BrowserRouter>
  )
}
