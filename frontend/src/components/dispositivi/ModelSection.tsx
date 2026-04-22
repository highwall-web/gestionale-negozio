import { ActionIcon, Button, Group, Loader, Modal, Pagination, Paper, ScrollArea, Select, SimpleGrid, Stack, Table, Text, TextInput, Title, Tooltip } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconPencil, IconSearch, IconTrash, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { getGetAllModelsPaginatedQueryKey, ModelSortBy, SortOrder, useDeleteModel, useGetAllModelsPaginated, type ModelResponse } from '../../api'
import { useQueryClient } from '@tanstack/react-query'
import ModalModificaModello from './ModalModificaModello'
import type { AxiosError } from 'axios'
import { getAxiosErrorMessage } from '../../utils/errorUtils'

const PAGE_SIZE = 20

const SORT_BY_OPTIONS = [
    { value: ModelSortBy.nome, label: 'Nome' },
    { value: ModelSortBy.brand, label: 'Brand' },
]

const SORT_ORDER_OPTIONS = [
    { value: SortOrder.asc, label: 'Crescente' },
    { value: SortOrder.desc, label: 'Decrescente' },
]

export default function ModelSection() {
    const [page, setPage] = useState(1)
    const [nome, setNome] = useState('')
    const [selectedModello, setSelectedModello] = useState<ModelResponse | null>(null)
    const [modelloToDelete, setModelloToDelete] = useState<ModelResponse | null>(null)
    const [brandNome, setBrandNome] = useState('')

    const queryClient = useQueryClient()
    const { mutate: deleteModello, isPending: isDeleting } = useDeleteModel({
        mutation: {
            onSuccess: () => {
                toast.success('Modello eliminato')
                queryClient.invalidateQueries({ queryKey: getGetAllModelsPaginatedQueryKey() })
                setModelloToDelete(null)
            },
            onError: (error: AxiosError) => toast.error(getAxiosErrorMessage(error)),
        }
    })
    const [debouncedNome] = useDebouncedValue(nome, 400)
    const [debouncedBrand] = useDebouncedValue(brandNome, 400)
    const [sortBy, setSortBy] = useState<ModelSortBy>(ModelSortBy.nome)
    const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.asc)

    const hasFilters = nome !== '' || brandNome !== ''

    const { data, isLoading } = useGetAllModelsPaginated({
        page, pageSize: PAGE_SIZE, sortBy, sortOrder,
        ...(debouncedNome ? { nome: debouncedNome } : {}),
        ...(debouncedBrand ? { brandNome: debouncedBrand } : {}),
    })
    const models = data?.data ?? []
    const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE)

    function handleReset() {
        setNome('')
        setBrandNome('')
        setSortBy(ModelSortBy.nome)
        setSortOrder(SortOrder.asc)
        setPage(1)
    }

    return (
        <>
            <Modal
                opened={modelloToDelete !== null}
                onClose={() => setModelloToDelete(null)}
                title="Conferma eliminazione"
                size="sm"
            >
                <Text mb="lg">
                    Sei sicuro di voler eliminare <strong>{modelloToDelete?.nome}</strong>? L'operazione non è reversibile.
                </Text>
                <Group justify="flex-end">
                    <Button variant="default" onClick={() => setModelloToDelete(null)}>Annulla</Button>
                    <Button color="red" loading={isDeleting} onClick={() => modelloToDelete && deleteModello({ id: modelloToDelete.id })}>Elimina</Button>
                </Group>
            </Modal>
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
                    {hasFilters && (
                        <Button variant="subtle" color="red" size="xs" leftSection={<IconX size={14} />} onClick={handleReset}>
                            Reimposta
                        </Button>
                    )}
                </Group>
                <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs" mb="sm">
                    <TextInput
                        label="Nome"
                        placeholder="Cerca modello"
                        value={nome}
                        onChange={e => { setNome(e.currentTarget.value); setPage(1) }}
                        leftSection={<IconSearch size={14} />}
                    />
                    <TextInput
                        label="Brand"
                        placeholder="Cerca brand"
                        value={brandNome}
                        onChange={e => { setBrandNome(e.currentTarget.value); setPage(1) }}
                    />
                    <Select
                        label="Ordina per"
                        data={SORT_BY_OPTIONS}
                        value={sortBy}
                        onChange={v => { if (v) setSortBy(v as ModelSortBy); setPage(1) }}
                    />
                    <Select
                        label="Ordinamento"
                        data={SORT_ORDER_OPTIONS}
                        value={sortOrder}
                        onChange={v => { if (v) setSortOrder(v as SortOrder); setPage(1) }}
                    />
                </SimpleGrid>
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
