import { ActionIcon, Button, Group, Loader, Modal, Pagination, Paper, ScrollArea, Select, SimpleGrid, Stack, Table, Text, TextInput, Title, Tooltip } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconPencil, IconSearch, IconTrash, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { getGetAllColorsPaginatedQueryKey, SortOrder, useDeleteColor, useGetAllColorsPaginated, type ColorResponse } from '../../api'
import { useQueryClient } from '@tanstack/react-query'
import ModalModificaColore from './ModalModificaColore'
import type { AxiosError } from 'axios'
import { getAxiosErrorMessage } from '../../utils/errorUtils'

const PAGE_SIZE = 20

const SORT_ORDER_OPTIONS = [
    { value: SortOrder.asc, label: 'Crescente' },
    { value: SortOrder.desc, label: 'Decrescente' },
]

export default function ColorSection() {
    const [page, setPage] = useState(1)
    const [nome, setNome] = useState('')
    const [selectedColore, setSelectedColore] = useState<ColorResponse | null>(null)
    const [coloreToDelete, setColoreToDelete] = useState<ColorResponse | null>(null)
    const [debouncedNome] = useDebouncedValue(nome, 400)
    const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.asc)

    const queryClient = useQueryClient()
    const { mutate: deleteColore, isPending: isDeleting } = useDeleteColor({
        mutation: {
            onSuccess: () => {
                toast.success('Colore eliminato')
                queryClient.invalidateQueries({ queryKey: getGetAllColorsPaginatedQueryKey() })
                setColoreToDelete(null)
            },
            onError: (error: AxiosError) => toast.error(getAxiosErrorMessage(error)),
        }
    })

    const { data, isLoading } = useGetAllColorsPaginated({
        page, pageSize: PAGE_SIZE, sortOrder,
        ...(debouncedNome ? { nome: debouncedNome } : {}),
    })
    const colors = data?.data ?? []
    const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE)

    return (
        <>
            <Modal
                opened={coloreToDelete !== null}
                onClose={() => setColoreToDelete(null)}
                title="Conferma eliminazione"
                size="sm"
            >
                <Text mb="lg">
                    Sei sicuro di voler eliminare <strong>{coloreToDelete?.nome}</strong>? L'operazione non è reversibile.
                </Text>
                <Group justify="flex-end">
                    <Button variant="default" onClick={() => setColoreToDelete(null)}>Annulla</Button>
                    <Button color="red" loading={isDeleting} onClick={() => coloreToDelete && deleteColore({ id: coloreToDelete.id })}>Elimina</Button>
                </Group>
            </Modal>
            {selectedColore && (
                <ModalModificaColore
                    key={selectedColore.id}
                    opened
                    onClose={() => setSelectedColore(null)}
                    colore={selectedColore}
                />
            )}
            <Paper radius={12} p="md">
                <Group justify="space-between" mb="sm">
                    <Title order={5}>
                        Colori
                        {!isLoading && <Text span c="dimmed" fw={400} ml={6} size="sm">({data?.total ?? 0})</Text>}
                    </Title>
                </Group>
                <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs" mb="sm">
                    <TextInput
                        label="Nome"
                        placeholder="Cerca colore"
                        value={nome}
                        onChange={e => { setNome(e.currentTarget.value); setPage(1) }}
                        leftSection={<IconSearch size={14} />}
                        rightSection={nome ? <IconX size={14} style={{ cursor: 'pointer' }} onClick={() => { setNome(''); setPage(1) }} /> : null}
                    />
                    <div />
                    <div />
                    <Select
                        label="Ordinamento"
                        data={SORT_ORDER_OPTIONS}
                        value={sortOrder}
                        onChange={v => { if (v) setSortOrder(v as SortOrder); setPage(1) }}
                    />
                </SimpleGrid>
                {isLoading ? (
                    <Stack align="center" py="xl"><Loader /></Stack>
                ) : colors.length === 0 ? (
                    <Text c="dimmed" ta="center" py="md">Nessun colore trovato</Text>
                ) : (
                    <ScrollArea>
                        <Table highlightOnHover>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Nome</Table.Th>
                                    <Table.Th style={{ textAlign: 'right' }}>Azioni</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {colors.map(c => (
                                    <Table.Tr key={c.id}>
                                        <Table.Td>{c.nome}</Table.Td>
                                        <Table.Td style={{ textAlign: 'right' }}>
                                            <Group gap={0} justify="flex-end">
                                                <Tooltip label="Modifica">
                                                    <ActionIcon variant="subtle" color="var(--mantine-primary-color-filled)" onClick={() => setSelectedColore(c)}>
                                                        <IconPencil size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                                <Tooltip label="Elimina">
                                                    <ActionIcon variant="subtle" color="red" style={{ color: 'var(--mantine-color-red-6)' }} onClick={() => setColoreToDelete(c)}>
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
