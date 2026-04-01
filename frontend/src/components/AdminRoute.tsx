import { Navigate, Outlet } from 'react-router-dom'
import { Role } from '../api'
import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../routes'

export default function AdminRoute() {
    const { isInRole } = useAuth()
    return isInRole(Role.ADMIN) ? <Outlet /> : <Navigate to={ROUTES.HOME} replace />
}
