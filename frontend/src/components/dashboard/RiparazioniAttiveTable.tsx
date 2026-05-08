import { Alert, ActionIcon, Badge, Group, Loader, Paper, Popover, ScrollArea, Stack, Table, Text, Title, Tooltip } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconChevronDown, IconChevronRight, IconChevronsDown, IconChevronsUp, IconEye, IconInfoCircle, IconPencil, IconRefresh, IconSend2 } from '@tabler/icons-react'
import { useState } from 'react'
import { getGetRepairsAttiveQueryKey, StatoRepair, useUpdateStatoRepair, type ProductResponse, type RepairResponse } from '../../api'
import { statoColors, statoRiparazioneColors } from '../../utils/riparazioniUtils'
import CambiaStatoModal from './ModalCambiaStato'
import PatternLock from '../PatternLock'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../../routes'

function LabelValue({ label, value }: { label: string; value: string }) {
    return (
        <Stack gap={0}>
            <Text size="xs" c="dimmed">{label}</Text>
            <Text size="xs">{value}</Text>
        </Stack>
    )
}

function SequenzaPopover({ sequenza }: { sequenza: number[] }) {
    const [opened, { open, close }] = useDisclosure(false)
    return (
        <Stack gap={0}>
            <Text size="xs" c="dimmed">Sequenza unlock</Text>
            <Popover opened={opened} withArrow shadow="md" position="top">
                <Popover.Target>
                    <ActionIcon variant="subtle" size="sm" color="dimmed" onMouseEnter={open} onMouseLeave={close}>
                        <IconEye size={14} />
                    </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown style={{ pointerEvents: 'none' }}>
                    <PatternLock value={sequenza} size={120} disabled />
                </Popover.Dropdown>
            </Popover>
        </Stack>
    )
}

function BadgesPopover({ product }: { product: ProductResponse }) {
    const [opened, { open, close }] = useDisclosure(false)
    const flags = [
        product.contattoConLiquidi && { label: 'Contatto con liquidi', color: 'red' },
        product.dispositivoNonTestabile && { label: 'Non testabile', color: 'orange' },
        product.acquistatoPressoDiNoi && { label: 'Acquistato da noi', color: 'teal' },
        product.lasciatoInNegozio && { label: 'Lasciato in negozio', color: 'blue' },
    ].filter(Boolean) as { label: string; color: string }[]

    if (flags.length === 0) return null
    return (
        <Stack gap={0}>
            <Text size="xs" c="dimmed">Flag</Text>
            <Popover opened={opened} withArrow shadow="md" position="top">
                <Popover.Target>
                    <ActionIcon variant="subtle" size="sm" color="dimmed" onMouseEnter={open} onMouseLeave={close}>
                        <IconEye size={14} />
                    </ActionIcon>
                </Popover.Target>
                <Popover.Dropdown style={{ pointerEvents: 'none' }}>
                    <Stack gap={4}>
                        {flags.map(f => <Badge key={f.label} radius="sm" color={f.color}>{f.label}</Badge>)}
                    </Stack>
                </Popover.Dropdown>
            </Popover>
        </Stack>
    )
}

interface Props {
    riparazioni: RepairResponse[],
    isLoading: boolean
}

const DETAIL_BG = 'var(--mantine-color-dark-6)'
const COL_COUNT = 9

export default function RiparazioniAttiveTable({ riparazioni, isLoading }: Props) {
    const queryClient = useQueryClient()
    const navigate = useNavigate()
    const [selectedRepair, setSelectedRepair] = useState<RepairResponse | null>(null)
    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false)
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
    const { mutate: updateStato, isPending } = useUpdateStatoRepair({
        mutation: {
            onSuccess: (res) => {
                toast.success(`Dispositivo riconsegnato il: ${res.details?.dataRiconsegnaEffettiva ? new Date(res.details.dataRiconsegnaEffettiva).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' }) : '—'}`)
                queryClient.invalidateQueries({ queryKey: getGetRepairsAttiveQueryKey() })
            },
        },
    })

    function toggleExpand(id: string) {
        setExpandedIds(prev => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    function handleCambiaStato(repair: RepairResponse) {
        setSelectedRepair(repair)
        openModal()
    }

    function handleConsegna(repair: RepairResponse) {
        updateStato({
            id: repair.id,
            data: { stato: StatoRepair.CONSEGNATO }
        })
    }

    const rows = riparazioni.flatMap((r) => {
        const isExpanded = expandedIds.has(r.id)
        const c = r.customer
        const p = r.product

        return [
            <Table.Tr
                key={r.id}
                onClick={() => toggleExpand(r.id)}
                style={{ cursor: 'pointer' }}
            >
                <Table.Td>
                    <Group gap={6} align="center" wrap="nowrap">
                        {isExpanded ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
                        {r.createdAt ? dayjs(r.createdAt).format('DD/MM/YYYY, HH:mm') : '—'}
                    </Group>
                </Table.Td>
                <Table.Td>{r.details?.dataConsegna ? dayjs(r.details.dataConsegna).format('DD/MM/YYYY, HH:mm') : '—'}</Table.Td>
                <Table.Td style={{ whiteSpace: 'nowrap' }}>{`${c.nome} ${c.cognome}`}</Table.Td>
                <Table.Td style={{ whiteSpace: 'nowrap' }}>{`${p.model.brandNome} ${p.model.nome}, ${p.color.nome}`}</Table.Td>
                <Table.Td style={{ whiteSpace: 'nowrap' }}>
                    {r.stato ? <Badge radius="sm" color={statoColors[r.stato] ?? 'gray'}>{r.stato.replace('_', ' ')}</Badge> : '—'}
                </Table.Td>
                <Table.Td style={{ whiteSpace: 'nowrap' }}>
                    {r.statoRiparazione ? <Badge radius="sm" color={statoRiparazioneColors[r.statoRiparazione] ?? 'gray'}>{r.statoRiparazione.replaceAll('_', ' ')}</Badge> : '—'}
                </Table.Td>
                <Table.Td>{r.costoTotale != null ? `€ ${r.details?.acconto?.toFixed(2)}` : '—'}</Table.Td>
                <Table.Td>{r.costoTotale != null ? `€ ${r.costoTotale.toFixed(2)}` : '—'}</Table.Td>
                <Table.Td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <Group gap={0} justify="flex-end">
                        {r.stato === StatoRepair.PRONTO && (
                            <Tooltip label="Consegna">
                                <ActionIcon variant='subtle' color="green" style={{ color: 'var(--mantine-color-green-6)' }} onClick={() => handleConsegna(r)} loading={isPending}>
                                    <IconSend2 size={16} />
                                </ActionIcon>
                            </Tooltip>
                        )}
                        <Tooltip label="Modifica">
                            <ActionIcon variant="subtle" color="var(--mantine-primary-color-filled)" onClick={() => navigate(ROUTES.MODIFICA_RIPARAZIONE.replace(':id', r.id))}>
                                <IconPencil size={16} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Cambia stato">
                            <ActionIcon variant="subtle" color="var(--mantine-primary-color-filled)" onClick={() => handleCambiaStato(r)} loading={isPending}>
                                <IconRefresh size={16} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Table.Td>
            </Table.Tr>,
            ...(isExpanded ? [
                <Table.Tr key={`${r.id}-customer`} style={{ backgroundColor: DETAIL_BG }}>
                    <Table.Td colSpan={COL_COUNT} style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 32 }}>
                        <Group gap={'xl'} align="flex-start">
                            <Text size="xs" fw={700} c="dimmed" style={{ minWidth: 70 }}>Cliente</Text>
                            <LabelValue label="Nome" value={`${c.nome} ${c.cognome}`} />
                            {c.email && <LabelValue label="Email" value={c.email} />}
                            {c.telefono && <LabelValue label="Telefono" value={c.telefono} />}
                            {c.telefonoSecondario && <LabelValue label="Tel. secondario" value={c.telefonoSecondario} />}
                            {(c.indirizzo || c.citta || c.cap) && (
                                <LabelValue label="Indirizzo" value={[c.indirizzo, c.citta, c.cap].filter(Boolean).join(', ')} />
                            )}
                        </Group>
                    </Table.Td>
                </Table.Tr>,
                <Table.Tr key={`${r.id}-product`} style={{ backgroundColor: DETAIL_BG }}>
                    <Table.Td colSpan={COL_COUNT} style={{ paddingTop: 8, paddingBottom: 8, paddingLeft: 32 }}>
                        <Group gap={'xl'} align="flex-start">
                            <Text size="xs" fw={700} c="dimmed" style={{ minWidth: 70 }}>Dispositivo</Text>
                            <LabelValue label="Modello" value={`${p.model.brandNome} ${p.model.nome}`} />
                            <LabelValue label="Colore" value={p.color.nome} />
                            {p.capacita && <LabelValue label="Capacità" value={p.capacita} />}
                            {p.seriale && <LabelValue label="Seriale" value={p.seriale} />}
                            {p.imei && <LabelValue label="IMEI" value={p.imei} />}
                            {p.codiceModello && <LabelValue label="Codice modello" value={p.codiceModello} />}
                            {p.pin && <LabelValue label="Pin" value={p.pin} />}
                            {p.codiceUnlock && <LabelValue label="Codice unlock" value={p.codiceUnlock} />}
                            {p.accessori && <LabelValue label="Accessori" value={p.accessori} />}
                            {(!!p.sequenzaUnlock && p.sequenzaUnlock.length > 0) && <SequenzaPopover sequenza={p.sequenzaUnlock} />}
                            <BadgesPopover product={p} />
                        </Group>
                    </Table.Td>
                </Table.Tr>,
            ] : []),
        ]
    })

    return (
        <>
            <CambiaStatoModal repair={selectedRepair} opened={modalOpened} onClose={closeModal} />
            <Paper radius={12} p="md">
                <Group justify="space-between" mb={4}>
                    <Title order={4}>Riparazioni attive</Title>
                    <Group gap={4}>
                        <Tooltip label="Espandi tutte">
                            <ActionIcon variant="subtle" color="dimmed" onClick={() => setExpandedIds(new Set(riparazioni.map(r => r.id)))}>
                                <IconChevronsDown size={16} />
                            </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Comprimi tutte">
                            <ActionIcon variant="subtle" color="dimmed" onClick={() => setExpandedIds(new Set())}>
                                <IconChevronsUp size={16} />
                            </ActionIcon>
                        </Tooltip>
                    </Group>
                </Group>
                <Alert mb="0" variant="light" color="blue" icon={<IconInfoCircle size={16} />} p="5">Clicca su una riga per espanderla e visualizzare i dati del cliente e del dispositivo.</Alert>
                {isLoading ? (
                    <Stack align="center" py="xl">
                        <Loader />
                    </Stack>
                ) : riparazioni?.length === 0 ? (
                    <Text c="dimmed" ta="center" py="xl">Nessuna riparazione attiva</Text>
                ) : (
                    <ScrollArea>
                        <Table highlightOnHover style={{ minWidth: 'max-content' }}>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Creata il</Table.Th>
                                    <Table.Th>Data di consegna stimata</Table.Th>
                                    <Table.Th>Cliente</Table.Th>
                                    <Table.Th>Dispositivo</Table.Th>
                                    <Table.Th>Stato</Table.Th>
                                    <Table.Th>Stato riparazione</Table.Th>
                                    <Table.Th>Acconto</Table.Th>
                                    <Table.Th>Totale</Table.Th>
                                    <Table.Th style={{ textAlign: 'right' }}>Azioni</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                    </ScrollArea>
                )}
            </Paper>
        </>
    )
}
