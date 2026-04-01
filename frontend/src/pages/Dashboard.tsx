import { Paper, Stack, Text, Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useAuth } from '../context/AuthContext'
import RiparazioniAttiveTable from '../components/dashboard/RiparazioniAttiveTable'
import RiparazioniAttiveTableMobile from '../components/dashboard/RiparazioniAttiveTableMobile'
import { useGetRepairsAttive } from '../api'

export default function Dashboard() {
    const { user } = useAuth()
    const { data: raw = [], isLoading } = useGetRepairsAttive()
    const riparazioni = [...raw].sort((a, b) =>
        new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    )
    const isMobile = useMediaQuery('(max-width: 768px)')

    return (
        <div>
            <Paper radius={12} p="md" mb="md">
                <Stack align="center" gap={4}>
                    <Title order={2}>Benvenuto, {user?.nome ?? 'utente'} 👋</Title>
                    <Text c="dimmed">Bentornato nel gestionale negozio. Usa la barra laterale per navigare.</Text>
                </Stack>
            </Paper>
            {isMobile
                ? <RiparazioniAttiveTableMobile riparazioni={riparazioni} isLoading={isLoading} />
                : <RiparazioniAttiveTable riparazioni={riparazioni} isLoading={isLoading} />
            }
        </div>
    )
}
