import { ActionIcon, Badge, Box, Center, Drawer, Group, Loader, Paper, Stack, Text, Title } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconMessageCircle } from '@tabler/icons-react'
import { useParams } from 'react-router-dom'
import { useGetRepairById } from '../api'
import MessaggiRiparazione from '../components/riparazioni/MessaggiRiparazione'
import { statoColors, statoRiparazioneColors } from '../utils/riparazioniUtils'

export default function ModificaRiparazione() {
    const { id } = useParams<{ id: string }>()
    const { data: repair, isLoading } = useGetRepairById(id!)
    const isMobile = useMediaQuery('(max-width: 768px)')
    const [drawerOpen, { open, close }] = useDisclosure(false)

    if (isLoading) return <Center py="xl"><Loader /></Center>
    if (!repair) return <Text c="dimmed" ta="center" py="xl">Riparazione non trovata</Text>

    return (
        <Stack gap="md">
            <Paper radius={12} p="md">
                <Group justify="space-between" align="center">
                    <Title order={4}>Modifica riparazione</Title>
                    <Group gap="md" align="center">
                        <Text c="dimmed" ff="monospace" size="sm">ID: {repair.id}</Text>
                        {repair.stato && (
                            <Group gap={4} align="center">
                                <Text size="xs" c="dimmed">Stato:</Text>
                                <Badge radius="sm" color={statoColors[repair.stato] ?? 'gray'}>
                                    {repair.stato.replace('_', ' ')}
                                </Badge>
                            </Group>
                        )}
                        {repair.statoRiparazione && (
                            <Group gap={4} align="center">
                                <Text size="xs" c="dimmed">Stato riparazione:</Text>
                                <Badge radius="sm" color={statoRiparazioneColors[repair.statoRiparazione] ?? 'gray'}>
                                    {repair.statoRiparazione.replaceAll('_', ' ')}
                                </Badge>
                            </Group>
                        )}
                    </Group>
                </Group>
            </Paper>

            <Group align="flex-start" gap="md" wrap="nowrap">
                <Stack flex={1} gap="md">
                    {/* spazio per altri paper */}
                </Stack>
                {!isMobile && (
                    <Box w={300} style={{ flexShrink: 0 }}>
                        <MessaggiRiparazione repairId={repair.id} details={repair.details} />
                    </Box>
                )}
            </Group>

            {isMobile && (
                <ActionIcon
                    size={52}
                    radius="xl"
                    onClick={open}
                    aria-label="Messaggi"
                    style={{ position: 'fixed', bottom: 12, right: 12, zIndex: 200, boxShadow: '0 4px 16px rgba(0,0,0,0.18)' }}
                >
                    <IconMessageCircle size={24} />
                </ActionIcon>
            )}

            <Drawer
                opened={drawerOpen}
                onClose={close}
                position="bottom"
                size="85%"
                title="Messaggi"
                styles={{ body: { padding: 0 }, header: { padding: '12px 16px' } }}
            >
                <Box p="md">
                    <MessaggiRiparazione repairId={repair.id} details={repair.details} scrollHeight={450} isMobile />
                </Box>
            </Drawer>
        </Stack>
    )
}
