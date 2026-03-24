import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import { AuthProvider } from './context/AuthContext'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import { createTheme, MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import 'dayjs/locale/it';
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from './context/ThemeContext'
import { ROUTES } from './routes'
import Accettazione from './pages/Accettazione'
import { AccettazioneProvider } from './context/AccettazioneContext'

const theme = createTheme({
    cursorType: 'pointer',
    black: '#181c1f',
    white: '#eef1f3'
});

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
                <MantineProvider theme={theme} defaultColorScheme="auto">
                    <DatesProvider settings={{ locale: 'it' }}>
                        <ThemeProvider>
                            <RouterProvider router={router} />
                        </ThemeProvider>
                    </DatesProvider>
                </MantineProvider>
            </AuthProvider>
        </>
    )
}

export default App
