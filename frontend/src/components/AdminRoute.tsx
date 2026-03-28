import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../routes'
import { UserResponseRole } from '../api'

export default function AdminRoute() {
    const { isInRole } = useAuth()
    return isInRole(UserResponseRole.ADMIN) ? <Outlet /> : <Navigate to={ROUTES.HOME} replace />
}
