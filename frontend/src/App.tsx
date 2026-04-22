import { createTheme, MantineProvider } from "@mantine/core"
import '@mantine/core/styles.css'
import { DatesProvider } from "@mantine/dates"
import '@mantine/dates/styles.css'
import '@mantine/schedule/styles.css'
import 'dayjs/locale/it'
import { lazy } from 'react'
import { Toaster } from "react-hot-toast"
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import AdminRoute from './components/AdminRoute'
import AppLayout from './components/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import RouteError from './components/RouteError'
import { AccettazioneProvider } from './context/AccettazioneContext'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ROUTES } from './routes'

const Login = lazy(() => import('./pages/Login'))
const Calendario = lazy(() => import('./pages/Calendario'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Accettazione = lazy(() => import('./pages/Accettazione'))
const CreaUtente = lazy(() => import('./pages/CreaUtente'))
const ModificaUtente = lazy(() => import('./pages/ModificaUtente'))
const GestioneRiparazioni = lazy(() => import('./pages/GestioneRiparazioni'))
const GestioneClienti = lazy(() => import('./pages/GestioneClienti'))
const GestioneDispositivi = lazy(() => import('./pages/GestioneDispositivi'))
const GestioneInterventi = lazy(() => import('./pages/GestioneInterventi'))
const ModificaRiparazione = lazy(() => import('./pages/ModificaRiparazione'))

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
                errorElement: <RouteError />,
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
                        element: <GestioneRiparazioni />,
                    },
                    {
                        path: ROUTES.GESTIONE_CLIENTI,
                        element: <GestioneClienti />,
                    },
                    {
                        path: ROUTES.GESTIONE_DISPOSITIVI,
                        element: <GestioneDispositivi />,
                    },
                    {
                        path: ROUTES.GESTIONE_INTERVENTI,
                        element: <GestioneInterventi />,
                    },
                    {
                        path: ROUTES.MODIFICA_RIPARAZIONE,
                        element: <ModificaRiparazione />,
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
