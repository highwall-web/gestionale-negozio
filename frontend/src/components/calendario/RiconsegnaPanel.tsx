import { Alert, Button, Checkbox, Group, Paper, ScrollArea, Stack, Text } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { IconInfoCircle } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'
import toast from 'react-hot-toast'
import {
    getGetRepairsByRangeDataConsegnaQueryKey,
    getGetRepairsSenzaDataRiconsegnaStiamataQueryKey,
    useGetRepairsSenzaDataRiconsegnaStiamata,
    useUpdateDataConsegna,
} from '../../api'

interface Props {
    datetime: string | null
    onClose: () => void
}

export default function RiconsegnaPanel({ datetime, onClose }: Props) {
    const initialDate = datetime && dayjs(datetime).isValid() ? datetime : null

    const [selected, setSelected] = useState<string | null>(null)
    const [dataRiconsegna, setDataRiconsegna] = useState<string | null>(initialDate)

    const queryClient = useQueryClient()
    const { data: repairs = [] } = useGetRepairsSenzaDataRiconsegnaStiamata()
    const { mutate: updateDetailsDate, isPending } = useUpdateDataConsegna({
        mutation: {
            onSuccess: () => {
                toast.success('Data di riconsegna aggiornata')
                queryClient.invalidateQueries({ queryKey: getGetRepairsSenzaDataRiconsegnaStiamataQueryKey() })
                queryClient.invalidateQueries({ queryKey: getGetRepairsByRangeDataConsegnaQueryKey() })
                onClose()
            },
            onError: () => toast.error('Errore durante il salvataggio')
        }
    })

    const handleReset = () => {
        setSelected(null)
        setDataRiconsegna(initialDate)
    }

    const handleToggle = (id: string) => {
        setSelected(prev => prev === id ? null : id)
    }

    const handleConferma = () => {
        if (!selected) return
        updateDetailsDate({
            repairId: selected,
            data: { dataConsegna: dataRiconsegna ? dayjs(dataRiconsegna).toISOString() : null }
        })
    }

    return (
        <Stack>
            <Alert icon={<IconInfoCircle size={16} />} color="blue">
                Seleziona una riparazione e imposta la data e ora di riconsegna stimata. Sono mostrate solo le riparazioni che non hanno ancora una data di riconsegna programmata.
            </Alert>
            <ScrollArea h={200} offsetScrollbars pr="xs" style={{ border: '1px solid var(--mantine-color-default-border)', borderRadius: 'var(--mantine-radius-md)' }} p="xs">
                <Stack gap="xs">
                    {repairs.length === 0 && (
                        <Text size="sm" c="dimmed" ta="center" py="md">
                            Non ci sono riparazioni senza una riconsegna stimata
                        </Text>
                    )}
                    {repairs.map(r => (
                        <Paper
                            key={r.id}
                            withBorder p="sm"
                            radius="sm"
                            onClick={() => handleToggle(r.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Group justify="space-between" wrap="nowrap">
                                <Stack gap={2}>
                                    <Text fw={500}>{r.customer.nome} {r.customer.cognome}</Text>
                                    <Text size="sm" c="dimmed">{r.product.model.brandNome} {r.product.model.nome}, {r.product.color.nome}</Text>
                                </Stack>
                                <Checkbox
                                    checked={selected === r.id}
                                    onChange={() => handleToggle(r.id)}
                                    onClick={e => e.stopPropagation()}
                                />
                            </Group>
                        </Paper>
                    ))}
                </Stack>
            </ScrollArea>
            <DateTimePicker
                label="Data e ora di riconsegna stimata"
                value={dataRiconsegna}
                onChange={setDataRiconsegna}
                locale="it"
                clearable
            />
            <Group justify="space-between">
                <Button variant="light" color="red" onClick={handleReset}>Reset</Button>
                <Button.Group>
                    <Button variant="default" onClick={onClose}>Annulla</Button>
                    <Button disabled={selected === null} loading={isPending} onClick={handleConferma}>
                        Conferma
                    </Button>
                </Button.Group>
            </Group>
        </Stack>
    )
}
