import { ActionIcon, Badge, Button, Group, Loader, Pagination, Paper, ScrollArea, Select, SimpleGrid, Stack, Table, Text, TextInput, Title, Tooltip } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconPlus, IconPencil, IconSearch, IconTrash, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RepairSortBy, SortOrder, StatoRepair, StatoRiparazione, useGetAllRepairs, type RepairResponse } from '../api'
import { ROUTES } from '../routes'
import { statoColors, statoOptions, statoRiparazioneColors, statoRiparazioneOptions } from '../utils/riparazioniUtils'
import dayjs from 'dayjs'
import ModalEliminaRiparazione from '../components/dashboard/ModalEliminaRiparazione'

const PAGE_SIZE = 20

const SORT_BY_OPTIONS = [
    { value: RepairSortBy.createdAt, label: 'Data creazione' },
    { value: RepairSortBy.costoTotale, label: 'Costo totale' },
    { value: RepairSortBy.stato, label: 'Stato' },
]

const SORT_ORDER_OPTIONS = [
    { value: SortOrder.desc, label: 'Decrescente' },
    { value: SortOrder.asc, label: 'Crescente' },
]

interface TextFilters {
    id: string
    nomeCliente: string
    cognomeCliente: string
    telefono: string
    imei: string
    seriale: string
}

const EMPTY_TEXT_FILTERS: TextFilters = {
    id: '', nomeCliente: '', cognomeCliente: '', telefono: '', imei: '', seriale: '',
}

export default function GestioneRiparazioni() {
    const navigate = useNavigate()
    const [page, setPage] = useState(1)
    const [riparazioneToDelete, setRiparazioneToDelete] = useState<RepairResponse | null>(null)
    const [textFilters, setTextFilters] = useState<TextFilters>(EMPTY_TEXT_FILTERS)
    const [debouncedText] = useDebouncedValue(textFilters, 400)
    const [stato, setStato] = useState<StatoRepair | null>(null)
    const [statoRiparazione, setStatoRiparazione] = useState<StatoRiparazione | null>(null)
    const [sortBy, setSortBy] = useState<RepairSortBy>(RepairSortBy.createdAt)
    const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.desc)

    const params = {
        page,
        size: PAGE_SIZE,
        sortBy,
        sortOrder,
        ...(stato ? { stato } : {}),
        ...(statoRiparazione ? { statoRiparazione } : {}),
        ...(debouncedText.id ? { id: debouncedText.id } : {}),
        ...(debouncedText.nomeCliente ? { nomeCliente: debouncedText.nomeCliente } : {}),
        ...(debouncedText.cognomeCliente ? { cognomeCliente: debouncedText.cognomeCliente } : {}),
        ...(debouncedText.telefono ? { telefono: debouncedText.telefono } : {}),
        ...(debouncedText.imei ? { imei: debouncedText.imei } : {}),
        ...(debouncedText.seriale ? { seriale: debouncedText.seriale } : {}),
    }

    const { data, isLoading } = useGetAllRepairs(params)
    const riparazioni = data?.data ?? []
    const total = data?.total ?? 0
    const totalPages = Math.ceil(total / PAGE_SIZE)

    function setTextField(field: keyof TextFilters, value: string) {
        setPage(1)
        setTextFilters(prev => ({ ...prev, [field]: value }))
    }

    function handleReset() {
        setTextFilters(EMPTY_TEXT_FILTERS)
        setStato(null)
        setStatoRiparazione(null)
        setSortBy(RepairSortBy.createdAt)
        setSortOrder(SortOrder.desc)
        setPage(1)
    }

    const hasActiveFilters = stato || statoRiparazione || Object.values(textFilters).some(v => v !== '')

    return (
        <>
        <ModalEliminaRiparazione riparazione={riparazioneToDelete} onClose={() => setRiparazioneToDelete(null)} />
        <Stack gap="md">
            <Paper radius={12} p="md">
                <Group justify="space-between" mb="sm">
                    <Title order={5}>Filtri</Title>
                    {hasActiveFilters && (
                        <Button variant="subtle" color="red" size="xs" leftSection={<IconX size={14} />} onClick={handleReset}>
                            Reimposta
                        </Button>
                    )}
                </Group>
                <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} spacing="xs">
                    <TextInput
                        label="ID"
                        placeholder="ID"
                        value={textFilters.id}
                        onChange={e => setTextField('id', e.currentTarget.value)}
                        leftSection={<IconSearch size={14} />}
                    />
                    <TextInput
                        label="Nome"
                        placeholder="Nome"
                        value={textFilters.nomeCliente}
                        onChange={e => setTextField('nomeCliente', e.currentTarget.value)}
                    />
                    <TextInput
                        label="Cognome"
                        placeholder="Cognome"
                        value={textFilters.cognomeCliente}
                        onChange={e => setTextField('cognomeCliente', e.currentTarget.value)}
                    />
                    <TextInput
                        label="Telefono"
                        placeholder="Telefono"
                        value={textFilters.telefono}
                        onChange={e => setTextField('telefono', e.currentTarget.value)}
                    />
                    <TextInput
                        label="IMEI"
                        placeholder="IMEI"
                        value={textFilters.imei}
                        onChange={e => setTextField('imei', e.currentTarget.value)}
                    />
                    <TextInput
                        label="Seriale"
                        placeholder="Seriale"
                        value={textFilters.seriale}
                        onChange={e => setTextField('seriale', e.currentTarget.value)}
                    />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs" mt="xs">
                    <Select
                        label="Stato"
                        placeholder="Tutti"
                        data={statoOptions}
                        value={stato}
                        onChange={v => { setStato(v as StatoRepair | null); setPage(1) }}
                        clearable
                    />
                    <Select
                        label="Stato riparazione"
                        placeholder="Tutti"
                        data={statoRiparazioneOptions}
                        value={statoRiparazione}
                        onChange={v => { setStatoRiparazione(v as StatoRiparazione | null); setPage(1) }}
                        clearable
                    />
                    <Select
                        label="Ordina per"
                        data={SORT_BY_OPTIONS}
                        value={sortBy}
                        onChange={v => { if (v) setSortBy(v as RepairSortBy); setPage(1) }}
                    />
                    <Select
                        label="Ordinamento"
                        data={SORT_ORDER_OPTIONS}
                        value={sortOrder}
                        onChange={v => { if (v) setSortOrder(v as SortOrder); setPage(1) }}
                    />
                </SimpleGrid>
            </Paper>

            <Paper radius={12} p="md">
                <Group justify="space-between" mb="sm">
                    <Title order={5}>
                        Riparazioni
                        {!isLoading && <Text span c="dimmed" fw={400} ml={6} size="sm">({total})</Text>}
                    </Title>
                    <Button size="xs" leftSection={<IconPlus size={14} />} onClick={() => navigate(ROUTES.ACCETTAZIONE)}>Nuova riparazione</Button>
                </Group>

                {isLoading ? (
                    <Stack align="center" py="xl"><Loader /></Stack>
                ) : riparazioni.length === 0 ? (
                    <Text c="dimmed" ta="center" py="xl">Nessuna riparazione trovata</Text>
                ) : (
                    <ScrollArea>
                        <Table highlightOnHover style={{ minWidth: 'max-content' }}>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>ID</Table.Th>
                                    <Table.Th>Creata il</Table.Th>
                                    <Table.Th>Consegna stimata</Table.Th>
                                    <Table.Th>Consegna effettiva</Table.Th>
                                    <Table.Th>Cliente</Table.Th>
                                    <Table.Th>Dispositivo</Table.Th>
                                    <Table.Th>Stato</Table.Th>
                                    <Table.Th>Stato riparazione</Table.Th>
                                    <Table.Th>Acconto</Table.Th>
                                    <Table.Th>Totale</Table.Th>
                                    <Table.Th style={{ textAlign: 'right' }}>Azioni</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {riparazioni.map(r => (
                                    <Table.Tr key={r.id}>
                                        <Table.Td>
                                            <Text size="xs" c="dimmed" ff="monospace">{r.id}</Text>
                                        </Table.Td>
                                        <Table.Td style={{ whiteSpace: 'nowrap' }}>
                                            {r.createdAt ? dayjs(r.createdAt).format('DD/MM/YYYY, HH:mm') : '—'}
                                        </Table.Td>
                                        <Table.Td style={{ whiteSpace: 'nowrap' }}>
                                            {r.details?.dataConsegna ? dayjs(r.details.dataConsegna).format('DD/MM/YYYY, HH:mm') : '—'}
                                        </Table.Td>
                                        <Table.Td style={{ whiteSpace: 'nowrap' }}>
                                            {r.details?.dataRiconsegnaEffettiva ? dayjs(r.details.dataRiconsegnaEffettiva).format('DD/MM/YYYY, HH:mm') : '—'}
                                        </Table.Td>
                                        <Table.Td style={{ whiteSpace: 'nowrap' }}>
                                            {r.customer.nome} {r.customer.cognome}
                                        </Table.Td>
                                        <Table.Td style={{ whiteSpace: 'nowrap' }}>
                                            {r.product.model.brandNome} {r.product.model.nome}, {r.product.color.nome}
                                        </Table.Td>
                                        <Table.Td>
                                            {r.stato ? <Badge radius="sm" color={statoColors[r.stato] ?? 'gray'}>{r.stato.replace(/_/g, ' ')}</Badge> : '—'}
                                        </Table.Td>
                                        <Table.Td>
                                            {r.statoRiparazione ? <Badge radius="sm" color={statoRiparazioneColors[r.statoRiparazione] ?? 'gray'}>{r.statoRiparazione.replace(/_/g, ' ')}</Badge> : '—'}
                                        </Table.Td>
                                        <Table.Td>{r.details?.acconto != null ? `€ ${r.details.acconto.toFixed(2)}` : '—'}</Table.Td>
                                        <Table.Td>{r.costoTotale != null ? `€ ${r.costoTotale.toFixed(2)}` : '—'}</Table.Td>
                                        <Table.Td style={{ textAlign: 'right' }}>
                                            <Group gap={0} justify="flex-end">
                                                <Tooltip label="Modifica">
                                                    <ActionIcon variant="subtle" color="var(--mantine-primary-color-filled)" onClick={() => navigate(ROUTES.MODIFICA_RIPARAZIONE.replace(':id', r.id))}>
                                                        <IconPencil size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                                <Tooltip label="Elimina">
                                                    <ActionIcon variant="subtle" color="red" style={{ color: 'var(--mantine-color-red-6)' }} onClick={() => setRiparazioneToDelete(r)}>
                                                        <IconTrash size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </ScrollArea>
                )}

                {totalPages > 1 && (
                    <Group justify="center" mt="md">
                        <Pagination total={totalPages} value={page} onChange={setPage} />
                    </Group>
                )}
            </Paper>
        </Stack>
        </>
    )
}
