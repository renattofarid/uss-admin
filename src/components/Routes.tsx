import { useContext, useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthContext } from '@/context/AuthContext'
import { Login, Posts } from '@/pages'
import { SpinnerSplash } from './SpinnerSplash'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { PostProvider } from '@/pages/Posts/context/PostContext'
// import { TagProvider } from '@/pages/Tags/context/TagContext'
// import TagsPage from '@/pages/Tags'
import { UserProvider } from '@/pages/Users/context/UserContext'
import UsersPage from '@/pages/Users'
import HomePosts from '@/pages/Home'
import AuthoritiesPage from '@/pages/Authorities'


export const RoutesApp = () => {
  const { authenticate, isAuthenticating } = useContext(AuthContext)

  useEffect(() => {
    authenticate()
  }, []);

  if (isAuthenticating) return <SpinnerSplash />

  return (
    <BrowserRouter>
      {/* <Navigation darkMode={darkMode} /> */}
      <Routes>
        {/* <Route
          path="/embarques"
          element={
            <ProtectedRoute
              // isAllowed={!!user && user.permisos.includes("/productos")}
              isAllowed={!!user}
            >
              <ShipmentProvider>
                <Shipments />
              </ShipmentProvider>
            </ProtectedRoute>
          }
        /> */}
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<DashboardLayout />}>
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
          {/* <Route path="tags" element={
            <TagProvider>
              <TagsPage />
            </TagProvider>
          } /> */}
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

        </Route>
      </Routes>
    </BrowserRouter>
  )
}
