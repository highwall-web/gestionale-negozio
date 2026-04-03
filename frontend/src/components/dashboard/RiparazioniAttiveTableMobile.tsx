import { Accordion, Badge, Button, Divider, Group, Loader, Paper, Stack, Text, Title } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconRefresh } from '@tabler/icons-react'
import { useState } from 'react'
import type { RepairResponse } from '../../api'
import { statoColors, statoRiparazioneColors } from '../../utils/riparazioniUtils'
import PatternLock from '../PatternLock'
import CambiaStatoModal from './ModalCambiaStato'

function RigaInfo({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <Stack justify="space-between" gap={1}>
            <Text size="xs" c="dimmed" style={{ minWidth: 120 }}>{label}</Text>
            <div>{children}</div>
        </Stack>
    )
}

interface Props {
    riparazioni: RepairResponse[]
    isLoading: boolean
}

export default function RiparazioniAttiveTableMobile({ riparazioni, isLoading }: Props) {
    const [selectedRepair, setSelectedRepair] = useState<RepairResponse | null>(null)
    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false)

    const handleCambiaStato = (repair: RepairResponse) => {
        setSelectedRepair(repair)
        openModal()
    }

    if (isLoading) return (
        <Paper radius={12} p="md">
            <Title order={4} mb="sm">Riparazioni attive</Title>
            <Stack align="center" py="xl"><Loader /></Stack>
        </Paper>
    )

    if (!riparazioni?.length) return (
        <Paper radius={12} p="md">
            <Title order={4} mb="sm">Riparazioni attive</Title>
            <Text c="dimmed" ta="center" py="xl">Nessuna riparazione attiva</Text>
        </Paper>
    )

    const cards = riparazioni.map((r) => {
        return (
            <Paper key={r.id} withBorder p="sm">
                <Stack gap={6}>
                    <RigaInfo label="Creata il">
                        <Text size="sm">{r.createdAt ? new Intl.DateTimeFormat('it-IT', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(r.createdAt)) : '—'}</Text>
                    </RigaInfo>
                    <RigaInfo label="Data di consegna stimata">
                        <Text size="sm">{r.details?.dataConsegna ? new Intl.DateTimeFormat('it-IT', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(r.details.dataConsegna)) : '—'}</Text>
                    </RigaInfo>
                    <Divider />
                    <Accordion variant="default" styles={{ control: { padding: '6px 0', color: 'var(--mantine-color-text)' }, label: { padding: 0 }, panel: { padding: 0 }, content: { padding: '4px 0 8px 0' }, chevron: { marginLeft: 'auto' }, item: { border: 'none' } }}>
                        <Accordion.Item value="cliente">
                            <Accordion.Control>
                                <Text size="xs" c="dimmed">Cliente</Text>
                                <Text size="sm" fw={500}>{r.customer.nome} {r.customer.cognome}</Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Stack gap={4}>
                                    <RigaInfo label="Email">
                                        <Text size="sm">{r.customer.email}</Text>
                                    </RigaInfo>
                                    <RigaInfo label="Telefono">
                                        <Text size="sm">{r.customer.telefono}</Text>
                                    </RigaInfo>
                                    {r.customer.telefonoSecondario && (
                                        <RigaInfo label="Telefono secondario">
                                            <Text size="sm">{r.customer.telefonoSecondario}</Text>
                                        </RigaInfo>
                                    )}
                                    {(r.customer.indirizzo || r.customer.citta || r.customer.cap) && (
                                        <RigaInfo label="Indirizzo">
                                            <Text size="sm">
                                                {[r.customer.indirizzo, r.customer.citta, r.customer.cap].filter(Boolean).join(', ')}
                                            </Text>
                                        </RigaInfo>
                                    )}
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>
                        <Accordion.Item value="dispositivo">
                            <Accordion.Control>
                                <Text size="xs" c="dimmed">Dispositivo</Text>
                                <Text size="sm" fw={500}>{r.product.model.brandNome} {r.product.model.nome}, {r.product.color.nome}</Text>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Stack gap={4}>
                                    {r.product.capacita && <RigaInfo label="Capacità"><Text size="sm">{r.product.capacita}</Text></RigaInfo>}
                                    {r.product.seriale && <RigaInfo label="Seriale"><Text size="sm">{r.product.seriale}</Text></RigaInfo>}
                                    {r.product.imei && <RigaInfo label="IMEI"><Text size="sm">{r.product.imei}</Text></RigaInfo>}
                                    {r.product.codiceModello && <RigaInfo label="Codice modello"><Text size="sm">{r.product.codiceModello}</Text></RigaInfo>}
                                    {r.product.pin && <RigaInfo label="PIN"><Text size="sm">{r.product.pin}</Text></RigaInfo>}
                                    {r.product.codiceUnlock && <RigaInfo label="Codice unlock"><Text size="sm">{r.product.codiceUnlock}</Text></RigaInfo>}
                                    {(!!r.product.sequenzaUnlock && r.product.sequenzaUnlock.length > 0) && (
                                        <RigaInfo label="Sequenza unlock">
                                            <PatternLock value={r.product.sequenzaUnlock} size={150} disabled />
                                        </RigaInfo>
                                    )}
                                    {r.product.accessori && <RigaInfo label="Accessori"><Text size="sm">{r.product.accessori}</Text></RigaInfo>}
                                    {r.product.contattoConLiquidi && <Text size="sm" c="red">Contatto con liquidi</Text>}
                                    {r.product.dispositivoNonTestabile && <Text size="sm" c="orange">Dispositivo non testabile</Text>}
                                    {r.product.acquistatoPressoDiNoi && <Text size="sm" c="teal">Acquistato presso di noi</Text>}
                                    {r.product.lasciatoInNegozio && <Text size="sm" c="blue">Lasciato in negozio</Text>}
                                </Stack>
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>
                    <Divider />
                    <RigaInfo label="Stato">
                        <Group gap={6}>
                            {r.stato ? <Badge radius="sm" color={statoColors[r.stato] ?? 'gray'}>{r.stato.replace('_', ' ')}</Badge> : '—'}
                        </Group>
                    </RigaInfo>
                    <RigaInfo label="Stato riparazione">
                        <Group gap={6}>
                            {r.statoRiparazione ? <Badge radius="sm" color={statoRiparazioneColors[r.statoRiparazione] ?? 'gray'}>{r.statoRiparazione.replaceAll('_', ' ')}</Badge> : '—'}
                        </Group>
                    </RigaInfo>
                    <Divider />
                    <RigaInfo label="Acconto">
                        <Text size="sm">{r.costoTotale != null ? `€ ${r.details?.acconto?.toFixed(2)}` : '—'}</Text>
                    </RigaInfo>
                    <RigaInfo label="Totale">
                        <Text size="sm">{r.costoTotale != null ? `€ ${r.costoTotale.toFixed(2)}` : '—'}</Text>
                    </RigaInfo>
                    <Divider />
                    <Group justify="flex-end">
                        <Button variant="subtle" size="xs" leftSection={<IconRefresh size={14} />} onClick={() => handleCambiaStato(r)}>
                            Cambia stato
                        </Button>
                        {/* TODO: aggiungi consegna */}
                    </Group>
                </Stack>
            </Paper>
        )
    })

    return (
        <>
            <CambiaStatoModal repair={selectedRepair} opened={modalOpened} onClose={closeModal} />
            <Paper radius={12} p="md">
                <Title order={4} mb="sm">Riparazioni attive</Title>
                <Stack gap="sm">{cards}</Stack>
            </Paper>
        </>
    )
}
