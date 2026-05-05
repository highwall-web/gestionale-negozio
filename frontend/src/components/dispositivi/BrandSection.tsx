import { ActionIcon, Button, Group, Loader, Pagination, Paper, ScrollArea, Select, Stack, Table, Text, TextInput, Title, Tooltip } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconPlus, IconPencil, IconSearch, IconTrash, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { SortOrder, useGetAllBrandsPaginated, type BrandResponse } from '../../api'
import ModalModificaBrand from './ModalModificaBrand'
import ModalCreaBrand from './ModalCreaBrand'
import ModalEliminaBrand from './ModalEliminaBrand'

const PAGE_SIZE = 20

const SORT_ORDER_OPTIONS = [
    { value: SortOrder.asc, label: 'Crescente' },
    { value: SortOrder.desc, label: 'Decrescente' },
]

export default function BrandSection() {
    const [page, setPage] = useState(1)
    const [nome, setNome] = useState('')
    const [createOpen, setCreateOpen] = useState(false)
    const [selectedBrand, setSelectedBrand] = useState<BrandResponse | null>(null)
    const [brandToDelete, setBrandToDelete] = useState<BrandResponse | null>(null)
    const [debouncedNome] = useDebouncedValue(nome, 400)
    const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.asc)

    const { data, isLoading } = useGetAllBrandsPaginated({
        page, pageSize: PAGE_SIZE, sortOrder,
        ...(debouncedNome ? { nome: debouncedNome } : {}),
    })
    const brands = data?.data ?? []
    const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE)

    return (
        <>
            <ModalCreaBrand opened={createOpen} onClose={() => setCreateOpen(false)} />
            <ModalEliminaBrand brand={brandToDelete} onClose={() => setBrandToDelete(null)} />
            {selectedBrand && (
                <ModalModificaBrand
                    key={selectedBrand.id}
                    opened
                    onClose={() => setSelectedBrand(null)}
                    brand={selectedBrand}
                />
            )}
            <Paper radius={12} p="md">
                <Group justify="space-between" mb="sm">
                    <Title order={5}>
                        Brand
                        {!isLoading && <Text span c="dimmed" fw={400} ml={6} size="sm">({data?.total ?? 0})</Text>}
                    </Title>
                    <Button size="xs" leftSection={<IconPlus size={14} />} onClick={() => setCreateOpen(true)}>Aggiungi</Button>
                </Group>
                <Stack gap="xs" mb="sm">
                    <TextInput
                        label="Nome"
                        placeholder="Cerca brand"
                        value={nome}
                        onChange={e => { setNome(e.currentTarget.value); setPage(1) }}
                        leftSection={<IconSearch size={14} />}
                        rightSection={nome ? <IconX size={14} style={{ cursor: 'pointer' }} onClick={() => { setNome(''); setPage(1) }} /> : null}
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
                ) : brands.length === 0 ? (
                    <Text c="dimmed" ta="center" py="md">Nessun brand trovato</Text>
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
                                {brands.map(b => (
                                    <Table.Tr key={b.id}>
                                        <Table.Td>{b.nome}</Table.Td>
                                        <Table.Td style={{ textAlign: 'right' }}>
                                            <Group gap={0} justify="flex-end">
                                                <Tooltip label="Modifica">
                                                    <ActionIcon variant="subtle" color="var(--mantine-primary-color-filled)" onClick={() => setSelectedBrand(b)}>
                                                        <IconPencil size={16} />
                                                    </ActionIcon>
                                                </Tooltip>
                                                <Tooltip label="Elimina">
                                                    <ActionIcon variant="subtle" color="red" style={{ color: 'var(--mantine-color-red-6)' }} onClick={() => setBrandToDelete(b)}>
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
