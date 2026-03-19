import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import '@mantine/core/styles.css'
import { MantineProvider } from "@mantine/core";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from './context/ThemeContext'

const router = createBrowserRouter([
    {
        path: '/login',
        element: <Login />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: '/',
                element: <Home />,
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
