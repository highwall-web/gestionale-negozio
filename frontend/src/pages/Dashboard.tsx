import { Paper, Stack, Text, Title } from '@mantine/core'
import { useAuth } from '../context/AuthContext'
import RiparazioniAttiveTable from '../components/dashboard/RiparazioniAttiveTable'

export default function Dashboard() {
    const { user } = useAuth()

    return (
        <div>
            <Paper radius={12} p="md" mb="md">
                <Stack align="center" gap={4}>
                    <Title order={2}>Benvenuto, {user?.username ?? 'utente'} 👋</Title>
                    <Text c="dimmed">Bentornato nel gestionale negozio. Usa la barra laterale per navigare.</Text>
                </Stack>
            </Paper>
            <RiparazioniAttiveTable />
        </div>
    )
}
