import { Button, Group, Modal, Paper, Stack, Text } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useState } from 'react'
import toast from 'react-hot-toast'
import {
    getGetRepairsByRangeDataConsegnaQueryKey,
    getGetRepairsSenzaDataRiconsegnaStiamataQueryKey,
    useUpdateDataConsegna,
    type RepairRangeResponse,
} from '../../api'

interface Props {
    opened: boolean
    onClose: () => void
    repair: RepairRangeResponse
}

export default function ModalModificaRiconsegna({ opened, onClose, repair }: Props) {
    const [dataRiconsegna, setDataRiconsegna] = useState<string | null>(repair.dataConsegna)

    const queryClient = useQueryClient()
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

    const handleReset = () => setDataRiconsegna(repair.dataConsegna)

    const handleSalva = () => {
        updateDetailsDate({
            repairId: repair.id,
            data: { dataConsegna: dataRiconsegna ? dayjs(dataRiconsegna).toISOString() : null }
        })
    }

    return (
        <Modal opened={opened} onClose={onClose} title="Modifica data riconsegna" size="md">
            <Stack>
                <Paper withBorder radius="sm" p="sm">
                    <Text fw={500}>{repair.nomeCliente} {repair.cognomeCliente}</Text>
                    <Text size="sm" c="dimmed">{repair.brand} {repair.modello}, {repair.colore}</Text>
                </Paper>
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
                        <Button loading={isPending} onClick={handleSalva}>Salva</Button>
                    </Button.Group>
                </Group>
            </Stack>
        </Modal>
    )
}
