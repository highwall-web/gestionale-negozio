import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../routes'
import { Center, Loader } from '@mantine/core'

export default function ProtectedRoute() {
    const { isAuthenticated, isLoading } = useAuth()

    if (isLoading) return <Center style={{ height: '100vh' }}><Loader size={'lg'} /></Center>

    return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />
}
