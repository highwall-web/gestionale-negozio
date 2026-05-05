import { ActionIcon, Badge, Button, Group, Loader, Pagination, Paper, ScrollArea, Select, SimpleGrid, Stack, Table, Text, TextInput, Title, Tooltip } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconPlus, IconPencil, IconSearch, IconTrash, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { InterventionSortBy, SortOrder, useGetAllInterventions, type InterventionResponse } from '../api'
import ModalModificaIntervento from '../components/interventi/ModalModificaIntervento'
import ModalCreaIntervento from '../components/interventi/ModalCreaIntervento'
import ModalEliminaIntervento from '../components/interventi/ModalEliminaIntervento'

const PAGE_SIZE = 20

const SORT_BY_OPTIONS = [
    { value: InterventionSortBy.nome, label: 'Nome' },
    { value: InterventionSortBy.prezzo, label: 'Prezzo' },
]

const SORT_ORDER_OPTIONS = [
    { value: SortOrder.asc, label: 'Crescente' },
    { value: SortOrder.desc, label: 'Decrescente' },
]

export default function GestioneInterventi() {
    const [page, setPage] = useState(1)
    const [createOpen, setCreateOpen] = useState(false)
    const [selectedIntervento, setSelectedIntervento] = useState<InterventionResponse | null>(null)
    const [interventoToDelete, setInterventoToDelete] = useState<InterventionResponse | null>(null)

    const [nome, setNome] = useState('')
    const [debouncedNome] = useDebouncedValue(nome, 400)
    const [sortBy, setSortBy] = useState<InterventionSortBy>(InterventionSortBy.nome)
    const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.asc)

    const params = {
        page,
        pageSize: PAGE_SIZE,
        sortBy,
        sortOrder,
        ...(debouncedNome ? { nome: debouncedNome } : {}),
    }

    const { data, isLoading } = useGetAllInterventions(params)
    const interventi = data?.data ?? []
    const total = data?.total ?? 0
    const totalPages = Math.ceil(total / PAGE_SIZE)

    function handleReset() {
        setNome('')
        setSortBy(InterventionSortBy.nome)
        setSortOrder(SortOrder.asc)
        setPage(1)
    }

    return (
        <>
            <ModalCreaIntervento opened={createOpen} onClose={() => setCreateOpen(false)} />
            <ModalEliminaIntervento intervento={interventoToDelete} onClose={() => setInterventoToDelete(null)} />
            {selectedIntervento && (
                <ModalModificaIntervento
                    key={selectedIntervento.id}
                    opened
                    onClose={() => setSelectedIntervento(null)}
                    intervento={selectedIntervento}
                />
            )}
            <Stack gap="md">
                <Paper radius={12} p="md">
                    <Group justify="space-between" mb="sm">
                        <Title order={5}>Filtri</Title>
                        {nome && (
                            <Button variant="subtle" color="red" size="xs" leftSection={<IconX size={14} />} onClick={handleReset}>
                                Reimposta
                            </Button>
                        )}
                    </Group>
                    <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs">
                        <TextInput
                            label="Nome"
                            placeholder="Nome intervento"
                            value={nome}
                            onChange={e => { setNome(e.currentTarget.value); setPage(1) }}
                            leftSection={<IconSearch size={14} />}
                        />
                        <div />
                        <Select
                            label="Ordina per"
                            data={SORT_BY_OPTIONS}
                            value={sortBy}
                            onChange={v => { if (v) setSortBy(v as InterventionSortBy); setPage(1) }}
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
                            Interventi
                            {!isLoading && <Text span c="dimmed" fw={400} ml={6} size="sm">({total})</Text>}
                        </Title>
                        <Button size="xs" leftSection={<IconPlus size={14} />} onClick={() => setCreateOpen(true)}>Aggiungi</Button>
                    </Group>

                    {isLoading ? (
                        <Stack align="center" py="xl"><Loader /></Stack>
                    ) : interventi.length === 0 ? (
                        <Text c="dimmed" ta="center" py="xl">Nessun intervento trovato</Text>
                    ) : (
                        <ScrollArea>
                            <Table highlightOnHover style={{ minWidth: 'max-content' }}>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Nome</Table.Th>
                                        <Table.Th>Tipo</Table.Th>
                                        <Table.Th>Modello</Table.Th>
                                        <Table.Th>Prezzo</Table.Th>
                                        <Table.Th>Garanzia (mesi)</Table.Th>
                                        <Table.Th style={{ textAlign: 'right' }}>Azioni</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {interventi.map(i => (
                                        <Table.Tr key={i.id}>
                                            <Table.Td>{i.nome}</Table.Td>
                                            <Table.Td>
                                                <Badge radius="sm" color={i.modelId ? 'violet' : 'teal'} variant="light">
                                                    {i.modelId ? 'Specifico' : 'Generale'}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td>{i.modelNome ?? '—'}</Table.Td>
                                            <Table.Td style={{ whiteSpace: 'nowrap' }}>€ {i.prezzo.toFixed(2)}</Table.Td>
                                            <Table.Td>{i.periodoGaranzia ?? '—'}</Table.Td>
                                            <Table.Td style={{ textAlign: 'right' }}>
                                                <Group gap={0} justify="flex-end">
                                                    <Tooltip label="Modifica">
                                                        <ActionIcon variant="subtle" color="var(--mantine-primary-color-filled)" onClick={() => setSelectedIntervento(i)}>
                                                            <IconPencil size={16} />
                                                        </ActionIcon>
                                                    </Tooltip>
                                                    <Tooltip label="Elimina">
                                                        <ActionIcon variant="subtle" color="red" style={{ color: 'var(--mantine-color-red-6)' }} onClick={() => setInterventoToDelete(i)}>
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
