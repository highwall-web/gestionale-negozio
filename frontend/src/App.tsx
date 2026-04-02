import './App.css'
import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import AdminRoute from './components/AdminRoute'
import { AuthProvider } from './context/AuthContext'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/schedule/styles.css';
import { createTheme, MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import 'dayjs/locale/it';
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from './context/ThemeContext'
import { ROUTES } from './routes'
import { AccettazioneProvider } from './context/AccettazioneContext'

const Login = lazy(() => import('./pages/Login'))
const Calendario = lazy(() => import('./pages/Calendario'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Accettazione = lazy(() => import('./pages/Accettazione'))
const CreaUtente = lazy(() => import('./pages/CreaUtente'))
const ModificaUtente = lazy(() => import('./pages/ModificaUtente'))

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
                    },
                    {
                        path: ROUTES.MODIFICA_UTENTE,
                        element: <ModificaUtente />,
                    },
                    {
                        path: ROUTES.CALENDARIO,
                        element: <Calendario />
                    },
                    {
                        path: ROUTES.GESTIONE_RIPARAZIONI,
                    },
                    {
                        path: ROUTES.GESTIONE_CLIENTI,
                    },
                    {
                        path: ROUTES.GESTIONE_DISPOSITIVI,
                    },
                    {
                        path: ROUTES.GESTIONE_INTERVENTI,
                    },
                    {
                        element: <AdminRoute />,
                        children: [
                            {
                                path: ROUTES.CREA_UTENTE,
                                element: <CreaUtente />,
                            }
                        ]
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
