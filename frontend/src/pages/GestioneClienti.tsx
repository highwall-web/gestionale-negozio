import { Button, Group, Loader, Pagination, Paper, ScrollArea, Select, SimpleGrid, Stack, Table, Text, TextInput, Title } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { IconSearch, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { CustomerSortBy, SortOrder, useGetAllCustomers } from '../api'

const PAGE_SIZE = 20

const SORT_BY_OPTIONS = [
    { value: CustomerSortBy.nome, label: 'Nome' },
    { value: CustomerSortBy.cognome, label: 'Cognome' },
    { value: CustomerSortBy.email, label: 'Email' },
]

const SORT_ORDER_OPTIONS = [
    { value: SortOrder.asc, label: 'Crescente' },
    { value: SortOrder.desc, label: 'Decrescente' },
]

interface TextFilters {
    nome: string
    cognome: string
    telefono: string
    email: string
}

const EMPTY_TEXT_FILTERS: TextFilters = {
    nome: '', cognome: '', telefono: '', email: '',
}

export default function GestioneClienti() {
    const [page, setPage] = useState(1)
    const [textFilters, setTextFilters] = useState<TextFilters>(EMPTY_TEXT_FILTERS)
    const [debouncedText] = useDebouncedValue(textFilters, 400)
    const [sortBy, setSortBy] = useState<CustomerSortBy>(CustomerSortBy.cognome)
    const [sortOrder, setSortOrder] = useState<SortOrder>(SortOrder.asc)

    const params = {
        page,
        pageSize: PAGE_SIZE,
        sortBy,
        sortOrder,
        ...(debouncedText.nome ? { nome: debouncedText.nome } : {}),
        ...(debouncedText.cognome ? { cognome: debouncedText.cognome } : {}),
        ...(debouncedText.telefono ? { telefono: debouncedText.telefono } : {}),
        ...(debouncedText.email ? { email: debouncedText.email } : {}),
    }

    const { data, isLoading } = useGetAllCustomers(params)
    const clienti = data?.data ?? []
    const total = data?.total ?? 0
    const totalPages = Math.ceil(total / PAGE_SIZE)

    function setTextField(field: keyof TextFilters, value: string) {
        setPage(1)
        setTextFilters(prev => ({ ...prev, [field]: value }))
    }

    function handleReset() {
        setTextFilters(EMPTY_TEXT_FILTERS)
        setSortBy(CustomerSortBy.cognome)
        setSortOrder(SortOrder.asc)
        setPage(1)
    }

    const hasActiveFilters = Object.values(textFilters).some(v => v !== '')

    return (
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
                <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs">
                    <TextInput
                        label="Nome"
                        placeholder="Nome"
                        value={textFilters.nome}
                        onChange={e => setTextField('nome', e.currentTarget.value)}
                        leftSection={<IconSearch size={14} />}
                    />
                    <TextInput
                        label="Cognome"
                        placeholder="Cognome"
                        value={textFilters.cognome}
                        onChange={e => setTextField('cognome', e.currentTarget.value)}
                    />
                    <TextInput
                        label="Telefono"
                        placeholder="Telefono"
                        value={textFilters.telefono}
                        onChange={e => setTextField('telefono', e.currentTarget.value)}
                    />
                    <TextInput
                        label="Email"
                        placeholder="Email"
                        value={textFilters.email}
                        onChange={e => setTextField('email', e.currentTarget.value)}
                    />
                </SimpleGrid>
                <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xs" mt="xs">
                    <Select
                        label="Ordina per"
                        data={SORT_BY_OPTIONS}
                        value={sortBy}
                        onChange={v => { if (v) setSortBy(v as CustomerSortBy); setPage(1) }}
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
                <Title order={5} mb="sm">
                    Clienti
                    {!isLoading && <Text span c="dimmed" fw={400} ml={6} size="sm">({total})</Text>}
                </Title>

                {isLoading ? (
                    <Stack align="center" py="xl"><Loader /></Stack>
                ) : clienti.length === 0 ? (
                    <Text c="dimmed" ta="center" py="xl">Nessun cliente trovato</Text>
                ) : (
                    <ScrollArea>
                        <Table striped highlightOnHover withTableBorder style={{ minWidth: 'max-content' }}>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Nome</Table.Th>
                                    <Table.Th>Cognome</Table.Th>
                                    <Table.Th>Email</Table.Th>
                                    <Table.Th>Telefono</Table.Th>
                                    <Table.Th>Tel. secondario</Table.Th>
                                    <Table.Th>Indirizzo</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {clienti.map(c => (
                                    <Table.Tr key={c.id}>
                                        <Table.Td>{c.nome}</Table.Td>
                                        <Table.Td>{c.cognome}</Table.Td>
                                        <Table.Td>{c.email ?? '—'}</Table.Td>
                                        <Table.Td style={{ whiteSpace: 'nowrap' }}>{c.telefono ?? '—'}</Table.Td>
                                        <Table.Td style={{ whiteSpace: 'nowrap' }}>{c.telefonoSecondario ?? '—'}</Table.Td>
                                        <Table.Td style={{ whiteSpace: 'nowrap' }}>
                                            {[c.indirizzo, c.citta, c.cap].filter(Boolean).join(', ') || '—'}
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
    )
}
