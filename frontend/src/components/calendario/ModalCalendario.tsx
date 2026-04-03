import { Alert, Button, Checkbox, Group, Modal, Paper, ScrollArea, Stack, Text } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { IconInfoCircle } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getGetRepairsByRangeDataConsegnaQueryKey, getGetRepairsSenzaDataRiconsegnaStiamataQueryKey, useGetRepairsSenzaDataRiconsegnaStiamata, useUpdateRepairDetails } from '../../api'

interface Props {
    opened: boolean
    onClose: () => void
    datetime: string | null
}

export default function CalendarioModal({ opened, onClose, datetime }: Props) {
    const [selected, setSelected] = useState<number | null>(null)
    const [dataRiconsegna, setDataRiconsegna] = useState<string | null>(null)

    const queryClient = useQueryClient()
    const { data: repairs = [] } = useGetRepairsSenzaDataRiconsegnaStiamata()
    const { mutate: updateDetails, isPending } = useUpdateRepairDetails({
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

    useEffect(() => {
        if (opened) {
            setSelected(null)
            setDataRiconsegna(datetime && dayjs(datetime).isValid() ? datetime : null)
        }
    }, [opened, datetime])

    const handleReset = () => {
        setSelected(null)
        setDataRiconsegna(datetime && dayjs(datetime).isValid() ? datetime : null)
    }

    const handleToggle = (id: number) => {
        setSelected(prev => prev === id ? null : id)
    }

    const handleConferma = () => {
        if (!selected) return;
        const selectedRepair = repairs.find(r => r.id === selected);
        if (!selectedRepair || !selectedRepair.details) return;
        updateDetails({
            repairId: selected,
            data: {
                isPreventivo: selectedRepair.details.isPreventivo,
                interventi: selectedRepair.details.interventi.map(i => ({ interventionId: i.interventionId, quantita: i.quantita })),
                acconto: selectedRepair.details.acconto,
                dataConsegna: dataRiconsegna ? dayjs(dataRiconsegna).toISOString() : undefined,
            }
        })
    }

    return (
        <Modal opened={opened} onClose={onClose} title="Inserisci data riconsegna" size="md">
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
                        <Button
                            disabled={selected === null}
                            loading={isPending}
                            onClick={handleConferma}
                        >
                            Conferma
                        </Button>
                    </Button.Group>
                </Group>
            </Stack>
        </Modal>
    )
}
