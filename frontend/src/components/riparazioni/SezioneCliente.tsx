import { ActionIcon, Autocomplete, Button, Group, Paper, SimpleGrid, Stack, Text, Title, Tooltip } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { IconPencil } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { getGetRepairByIdQueryKey, searchCustomers, useUpdateClienteRepair, type CustomerResponse } from '../../api'
import ModalModificaCliente from '../clienti/ModalModificaCliente'

interface Props {
    customer: CustomerResponse
    repairId: string
}

function formatCliente(c: CustomerResponse) {
    return `${c.nome} ${c.cognome} — ${c.telefono}`
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <Group gap="xs">
            <Text size="sm" c="dimmed" w={120}>{label}</Text>
            <Text size="sm">{value}</Text>
        </Group>
    )
}

export default function SezioneCliente({ customer, repairId }: Props) {
    const [search, setSearch] = useState('')
    const [results, setResults] = useState<CustomerResponse[]>([])
    const [selected, setSelected] = useState<CustomerResponse>(customer)
    const [editOpen, setEditOpen] = useState(false)
    const justPicked = useRef(false)
    const queryClient = useQueryClient()

    const { mutate: updateCliente, isPending } = useUpdateClienteRepair({
        mutation: {
            onSuccess: () => {
                toast.success('Cliente aggiornato')
                queryClient.invalidateQueries({ queryKey: getGetRepairByIdQueryKey(repairId) })
            },
            onError: () => toast.error('Errore durante il salvataggio'),
        }
    })

    const [dSearch] = useDebouncedValue(search, 300)
    const unchanged = selected.id === customer.id

    useEffect(() => {
        setSelected(customer)
    }, [customer])

    useEffect(() => {
        if (!dSearch) return
        const [nome, cognome] = dSearch.trim().split(' ')
        searchCustomers({ nome: nome || undefined, cognome: cognome || undefined })
            .then(setResults)
    }, [dSearch])

    function handlePick(value: string) {
        const found = results.find(c => formatCliente(c) === value)
        if (!found) return
        justPicked.current = true
        setSelected(found)
        setSearch('')
    }

    return (
        <Paper radius={12} p="md">
            <Stack gap="sm">
                <Group justify="space-between" align="center">
                    <Title order={5}>Cliente</Title>
                    <Text size="xs" c="dimmed" ff="monospace">ID: {selected.id}</Text>
                </Group>

                <Text size="sm" c="dimmed">
                    Cliente attuale: <Text span fw={500} c="var(--mantine-color-text)">{customer.nome} {customer.cognome}</Text>
                </Text>

                <Autocomplete
                    placeholder="Cerca cliente da sostituire..."
                    data={results.map(formatCliente)}
                    value={search}
                    onChange={(v) => {
                        if (justPicked.current) { justPicked.current = false; return }
                        setSearch(v)
                        if (!v) setResults([])
                    }}
                    onOptionSubmit={handlePick}
                />

                <Paper withBorder radius={8} p="sm" style={{ position: 'relative' }}>
                    <Tooltip label="Modifica dati cliente">
                        <ActionIcon
                            variant="subtle"
                            color="var(--mantine-primary-color-filled)"
                            onClick={() => setEditOpen(true)}
                            style={{ position: 'absolute', top: 6, right: 6 }}
                        >
                            <IconPencil size={16} />
                        </ActionIcon>
                    </Tooltip>
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={'xs'}>
                        <InfoRow label="Nome" value={selected.nome} />
                        <InfoRow label="Cognome" value={selected.cognome} />
                        <InfoRow label="Email" value={selected.email} />
                        <InfoRow label="Telefono" value={selected.telefono} />
                        {selected.telefonoSecondario && <InfoRow label="Tel. secondario" value={selected.telefonoSecondario} />}
                        {selected.indirizzo && <InfoRow label="Indirizzo" value={selected.indirizzo} />}
                        {selected.citta && <InfoRow label="Città" value={selected.citta} />}
                        {selected.cap && <InfoRow label="CAP" value={selected.cap} />}
                    </SimpleGrid>
                </Paper>
                <ModalModificaCliente
                    key={selected.id}
                    opened={editOpen}
                    onClose={() => setEditOpen(false)}
                    cliente={selected}
                    onSuccess={() => queryClient.invalidateQueries({ queryKey: getGetRepairByIdQueryKey(repairId) })}
                />

                <Group justify="flex-end" gap="xs">
                    <Button variant="light" color="red" disabled={unchanged} onClick={() => { setSelected(customer); setSearch('') }}>Reset</Button>
                    <Button
                        disabled={unchanged}
                        loading={isPending}
                        onClick={() => updateCliente({ id: repairId, data: { customerId: selected.id } })}
                    >Salva</Button>
                </Group>
            </Stack>
        </Paper>
    )
}
