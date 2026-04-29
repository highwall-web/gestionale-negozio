import { ActionIcon, Badge, Box, Center, Drawer, Group, Loader, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconArrowLeft, IconMessageCircle } from '@tabler/icons-react'
import dayjs from 'dayjs'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetRepairById } from '../api'
import MessaggiRiparazione from '../components/riparazioni/MessaggiRiparazione'
import SezioneCliente from '../components/riparazioni/SezioneCliente'
import SezioneDettagli from '../components/riparazioni/SezioneDettagli'
import SezioneDispositivo from '../components/riparazioni/SezioneDispositivo'
import SezioneStato from '../components/riparazioni/SezioneStato'
import { statoColors, statoRiparazioneColors } from '../utils/riparazioniUtils'

export default function ModificaRiparazione() {
    const navigate = useNavigate()
    const { id } = useParams<{ id: string }>()
    const { data: repair, isLoading } = useGetRepairById(id!)
    const isMobile = useMediaQuery('(max-width: 768px)')
    const [drawerOpen, { open, close }] = useDisclosure(false)

    if (isLoading) return <Center py="xl"><Loader /></Center>
    if (!repair) return <Text c="dimmed" ta="center" py="xl">Riparazione non trovata</Text>

    return (
        <Stack gap="md" pb={isMobile ? 80 : undefined}>
            <Paper radius={12} p="md" shadow="md" ta='start' style={{ position: 'sticky', top: 'var(--mantine-spacing-md)', zIndex: 100 }}>
                <Group justify="space-between" align="center">
                    <Group gap="sm" align="center">
                        <ActionIcon variant="subtle" onClick={() => navigate(-1)}>
                            <IconArrowLeft size={18} />
                        </ActionIcon>
                        <Title order={4}>Modifica riparazione</Title>
                    </Group>
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
                        {repair.createdAt && (
                            <Group gap={4} align="center">
                                <Text size="xs" c="dimmed">Creata il:</Text>
                                <Text size="sm">{dayjs(repair.createdAt).format('DD/MM/YYYY, HH:mm')}</Text>
                            </Group>
                        )}
                        {repair.costoTotale != null && (
                            <Group gap={4} align="center">
                                <Text size="xs" c="dimmed">Totale:</Text>
                                <Text size="sm" fw={500}>€ {repair.costoTotale.toFixed(2)}</Text>
                            </Group>
                        )}
                    </Group>
                </Group>
            </Paper>

            <Group align="flex-start" gap="md" wrap="nowrap">
                <Stack flex={1} gap="md">
                    {isMobile && <SezioneStato repair={repair} />}
                    <SezioneCliente customer={repair.customer} repairId={repair.id} />
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                        <SezioneDispositivo product={repair.product} />
                        <SezioneDettagli repair={repair} />
                    </SimpleGrid>
                </Stack>
                {!isMobile && (
                    <Box w={300} style={{ flexShrink: 0 }}>
                        <Stack gap="md">
                            <SezioneStato repair={repair} />
                            <MessaggiRiparazione repairId={repair.id} details={repair.details} />
                        </Stack>
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
                size="100%"
                title="Messaggi"
                styles={{
                    content: { display: 'flex', flexDirection: 'column' },
                    body: { padding: 0, flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
                    header: { padding: 'var(--mantine-spacing-md)' },
                }}
            >
                <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <MessaggiRiparazione repairId={repair.id} details={repair.details} isMobile />
                </Box>
            </Drawer>
        </Stack>
    )
}
