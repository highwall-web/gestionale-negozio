import { Button, Group, Loader, Pagination, Paper, ScrollArea, Select, SimpleGrid, Stack, Table, Text, TextInput, Title } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { ModelSortBy, SortOrder, useGetAllModelsPaginated } from '../../api'

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
    const [brandNome, setBrandNome] = useState('')
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
                    <Table striped highlightOnHover withTableBorder style={{ minWidth: 'max-content' }}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Nome</Table.Th>
                                <Table.Th>Brand</Table.Th>
                                <Table.Th>Tipo dispositivo</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {models.map(m => (
                                <Table.Tr key={m.id}>
                                    <Table.Td>{m.nome}</Table.Td>
                                    <Table.Td>{m.brandNome}</Table.Td>
                                    <Table.Td>{m.tipoDispositivo ?? '—'}</Table.Td>
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
