import { Group, Loader, Pagination, Paper, ScrollArea, Select, SimpleGrid, Stack, Table, Text, TextInput, Title } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { SortOrder, useGetAllBrandsPaginated } from '../../api'

const PAGE_SIZE = 20

const SORT_ORDER_OPTIONS = [
    { value: SortOrder.asc, label: 'Crescente' },
    { value: SortOrder.desc, label: 'Decrescente' },
]

export default function BrandSection() {
    const [page, setPage] = useState(1)
    const [nome, setNome] = useState('')
    const [debouncedNome] = useDebouncedValue(nome, 400)
    const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.asc)

    const { data, isLoading } = useGetAllBrandsPaginated({
        page, pageSize: PAGE_SIZE, sortOrder,
        ...(debouncedNome ? { nome: debouncedNome } : {}),
    })
    const brands = data?.data ?? []
    const totalPages = Math.ceil((data?.total ?? 0) / PAGE_SIZE)

    return (
        <Paper radius={12} p="md">
            <Group justify="space-between" mb="sm">
                <Title order={5}>
                    Brand
                    {!isLoading && <Text span c="dimmed" fw={400} ml={6} size="sm">({data?.total ?? 0})</Text>}
                </Title>
            </Group>
            <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs" mb="sm">
                <TextInput
                    label="Nome"
                    placeholder="Cerca brand"
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
            ) : brands.length === 0 ? (
                <Text c="dimmed" ta="center" py="md">Nessun brand trovato</Text>
            ) : (
                <ScrollArea>
                    <Table striped highlightOnHover withTableBorder>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Nome</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {brands.map(b => (
                                <Table.Tr key={b.id}>
                                    <Table.Td>{b.nome}</Table.Td>
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
    )
}
