import { ActionIcon, Button, Group, Loader, Pagination, Paper, ScrollArea, Select, Stack, Table, Text, TextInput, Title, Tooltip } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconPlus, IconPencil, IconSearch, IconTrash, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { ModelSortBy, SortOrder, useGetAllModelsPaginated, type ModelResponse } from '../../api'
import ModalModificaModello from './ModalModificaModello'
import ModalCreaModello from './ModalCreaModello'
import ModalEliminaModello from './ModalEliminaModello'

const PAGE_SIZE = 20

const SORT_ORDER_OPTIONS = [
    { value: SortOrder.asc, label: 'Crescente' },
    { value: SortOrder.desc, label: 'Decrescente' },
]

export default function ModelSection() {
    const [page, setPage] = useState(1)
    const [nome, setNome] = useState('')
    const [createOpen, setCreateOpen] = useState(false)
    const [selectedModello, setSelectedModello] = useState<ModelResponse | null>(null)
    const [modelloToDelete, setModelloToDelete] = useState<ModelResponse | null>(null)
    const [debouncedNome] = useDebouncedValue(nome, 400)
    const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.asc)

    const { data, isLoading } = useGetAllModelsPaginated({
        page, pageSize: PAGE_SIZE, sortBy: ModelSortBy.nome, sortOrder,
        ...(debouncedNome ? { nome: debouncedNome } : {}),
    })
    const models = data?.data ?? []
    const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE)

    function handleReset() {
        setNome('')
        setSortOrder(SortOrder.asc)
        setPage(1)
    }

    return (
        <>
            <ModalCreaModello opened={createOpen} onClose={() => setCreateOpen(false)} />
            <ModalEliminaModello modello={modelloToDelete} onClose={() => setModelloToDelete(null)} />
            {selectedModello && (
                <ModalModificaModello
                    key={selectedModello.id}
                    opened
                    onClose={() => setSelectedModello(null)}
                    modello={selectedModello}
                />
            )}
            <Paper radius={12} p="md">
                <Group justify="space-between" mb="sm">
                    <Title order={5}>
                        Modelli
                        {!isLoading && <Text span c="dimmed" fw={400} ml={6} size="sm">({data?.total ?? 0})</Text>}
                    </Title>
                    <Group gap="xs">
                        {nome && (
                            <Button variant="subtle" color="red" size="xs" leftSection={<IconX size={14} />} onClick={handleReset}>
                                Reimposta
                            </Button>
                        )}
                        <Button size="xs" leftSection={<IconPlus size={14} />} onClick={() => setCreateOpen(true)}>Aggiungi</Button>
                    </Group>
                </Group>
                <Stack gap="xs" mb="sm">
                    <TextInput
                        label="Nome"
                        placeholder="Cerca modello"
                        value={nome}
                        onChange={e => { setNome(e.currentTarget.value); setPage(1) }}
                        leftSection={<IconSearch size={14} />}
                    />
                    <Select
                        label="Ordinamento"
                        data={SORT_ORDER_OPTIONS}
                        value={sortOrder}
                        onChange={v => { if (v) setSortOrder(v as SortOrder); setPage(1) }}
                    />
                </Stack>
                {isLoading ? (
                    <Stack align="center" py="xl"><Loader /></Stack>
                ) : models.length === 0 ? (
                    <Text c="dimmed" ta="center" py="md">Nessun modello trovato</Text>
                ) : (
                    <ScrollArea>
                        <Table highlightOnHover style={{ minWidth: 'max-content' }}>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Nome</Table.Th>
                                    <Table.Th>Brand</Table.Th>
                                    <Table.Th>Tipo dispositivo</Table.Th>
                                    <Table.Th style={{ textAlign: 'right' }}>Azioni</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {models.map(m => (
                                    <Table.Tr key={m.id}>
                                        <Table.Td>{m.nome}</Table.Td>
                                        <Table.Td>{m.brandNome}</Table.Td>
                                        <Table.Td style={{ textTransform: 'capitalize' }}>{m.tipoDispositivo?.toLowerCase() ?? '—'}</Table.Td>
                                        <Table.Td style={{ textAlign: 'right' }}>
                                            <Group gap={0} justify="flex-end">
                                                <Tooltip label="Modifica">
                                                    <ActionIcon variant="subtle" color="var(--mantine-primary-color-filled)" onClick={() => setSelectedModello(m)}>
                                                        <IconPencil size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                                <Tooltip label="Elimina">
                                                    <ActionIcon variant="subtle" color="red" style={{ color: 'var(--mantine-color-red-6)' }} onClick={() => setModelloToDelete(m)}>
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
        </>
    )
}
