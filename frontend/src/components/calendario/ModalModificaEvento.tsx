import { Button, Group, Modal, Stack, TextInput } from '@mantine/core'
import { DatePickerInput, TimeInput } from '@mantine/dates'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { getGetAllEventsQueryKey, getGetEventsByRangeDataQueryKey, useUpdateEvent, type EventResponse } from '../../api'

interface Props {
    opened: boolean
    onClose: () => void
    evento: EventResponse
}

export default function ModalModificaEvento({ opened, onClose, evento }: Props) {
    const [descrizione, setDescrizione] = useState(evento.descrizione)
    const [dataEvento, setDataEvento] = useState<string | null>(evento.dataEvento)
    const [oraInizio, setOraInizio] = useState(evento.oraInizio)
    const [oraFine, setOraFine] = useState(evento.oraFine)

    const queryClient = useQueryClient()
    const { mutate: updateEvent, isPending } = useUpdateEvent({
        mutation: {
            onSuccess: () => {
                toast.success('Evento aggiornato')
                queryClient.invalidateQueries({ queryKey: getGetAllEventsQueryKey() })
                queryClient.invalidateQueries({ queryKey: getGetEventsByRangeDataQueryKey() })
                onClose()
            },
            onError: () => toast.error('Errore durante il salvataggio')
        }
    })

    const handleReset = () => {
        setDescrizione(evento.descrizione)
        setDataEvento(evento.dataEvento)
        setOraInizio(evento.oraInizio)
        setOraFine(evento.oraFine)
    }

    const handleSalva = () => {
        if (!descrizione || !dataEvento || !oraInizio || !oraFine) return
        updateEvent({
            id: evento.id,
            data: {
                descrizione,
                dataEvento: dataEvento!,
                oraInizio,
                oraFine,
            }
        })
    }

    return (
        <Modal opened={opened} onClose={onClose} title="Modifica evento" size="md">
            <Stack>
                <TextInput
                    label="Descrizione"
                    value={descrizione}
                    onChange={e => setDescrizione(e.currentTarget.value)}
                />
                <DatePickerInput
                    label="Data"
                    value={dataEvento}
                    onChange={setDataEvento}
                    locale="it"
                    clearable
                />
                <Group grow>
                    <TimeInput
                        label="Ora inizio"
                        value={oraInizio}
                        onChange={e => setOraInizio(e.currentTarget.value)}
                    />
                    <TimeInput
                        label="Ora fine"
                        value={oraFine}
                        onChange={e => setOraFine(e.currentTarget.value)}
                    />
                </Group>
                <Group justify="space-between">
                    <Button variant="light" color="red" onClick={handleReset}>Reset</Button>
                    <Button.Group>
                        <Button variant="default" onClick={onClose}>Annulla</Button>
                        <Button
                            disabled={!descrizione || !dataEvento || !oraInizio || !oraFine}
                            loading={isPending}
                            onClick={handleSalva}
                        >
                            Salva
                        </Button>
                    </Button.Group>
                </Group>
            </Stack>
        </Modal>
    )
}
