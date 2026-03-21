import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import { AuthProvider } from './context/AuthContext'
import '@mantine/core/styles.css'
import { MantineProvider } from "@mantine/core";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from './context/ThemeContext'
import { ROUTES } from './routes'
import Accettazione from './pages/Accettazione'
import { AccettazioneProvider } from './context/AccettazioneContext'

const router = createBrowserRouter([
    {
        path: ROUTES.LOGIN,
        element: <Login />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    {
                        path: ROUTES.HOME,
                        element: <Dashboard />,
                    },
                    {
                        path: ROUTES.ACCETTAZIONE,
                        element: <AccettazioneProvider>
                            <Accettazione />
                        </AccettazioneProvider>,
                    }
                ],
            },
        ],
    },
])

function App() {
    return (
        <>
            <Toaster />
            <AuthProvider>
                <MantineProvider theme={{ black: '#181c1f', white: '#eef1f3' }} defaultColorScheme="auto">
                    <ThemeProvider>
                        <RouterProvider router={router} />
                    </ThemeProvider>
                </MantineProvider>
            </AuthProvider>
        </>
    )
}

export default App
