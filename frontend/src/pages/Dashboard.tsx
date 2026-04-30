import { Grid, Paper, Stack, Text, Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { useAuth } from '../context/AuthContext'
import RiparazioniAttiveTable from '../components/dashboard/RiparazioniAttiveTable'
import RiparazioniAttiveTableMobile from '../components/dashboard/RiparazioniAttiveTableMobile'
import Avvisi from '../components/dashboard/Avvisi'
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
            <Grid mb="md" align="stretch">
                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Paper radius={12} p="md" h="100%">
                        <Stack align="center" justify="center" h="100%" gap={4}>
                            <Title order={2}>Benvenuto, {user?.nome ?? 'utente'} 👋</Title>
                            <Text c="dimmed">Bentornato nel gestionale negozio. Usa la barra laterale per navigare.</Text>
                        </Stack>
                    </Paper>
                </Grid.Col>
                <Grid.Col span={{ base: 12, sm: 6 }}>
                    <Avvisi riparazioni={riparazioni} isLoading={isLoading} />
                </Grid.Col>
            </Grid>
            {isMobile
                ? <RiparazioniAttiveTableMobile riparazioni={riparazioni} isLoading={isLoading} />
                : <RiparazioniAttiveTable riparazioni={riparazioni} isLoading={isLoading} />
            }
        </div>
    )
}
