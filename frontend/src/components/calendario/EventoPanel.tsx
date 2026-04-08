import { Button, Group, Stack, TextInput } from '@mantine/core'
import { DatePickerInput, TimeInput } from '@mantine/dates'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { getGetEventsByRangeDataQueryKey, useCreateEvent } from '../../api'

interface Props {
    datetime: string | null
    onClose: () => void
}

export default function EventoPanel({ datetime, onClose }: Props) {
    const initialDate = datetime && dayjs(datetime).isValid() ? dayjs(datetime).toDate() : null
    const initialTime = datetime && dayjs(datetime).isValid() ? dayjs(datetime).format('HH:mm') : ''

    const [descrizione, setDescrizione] = useState('')
    const [dataEvento, setDataEvento] = useState<Date | null>(initialDate)
    const [oraInizio, setOraInizio] = useState(initialTime)
    const [oraFine, setOraFine] = useState('')

    useEffect(() => {
        setDataEvento(datetime && dayjs(datetime).isValid() ? dayjs(datetime).toDate() : null)
        setOraInizio(datetime && dayjs(datetime).isValid() ? dayjs(datetime).format('HH:mm') : '')
        setOraFine('')
        setDescrizione('')
    }, [datetime])

    const queryClient = useQueryClient()
    const { mutate: createEvent, isPending } = useCreateEvent({
        mutation: {
            onSuccess: () => {
                toast.success('Evento creato')
                queryClient.invalidateQueries({ queryKey: getGetEventsByRangeDataQueryKey() })
                onClose()
            },
            onError: () => toast.error('Errore durante la creazione')
        }
    })

    const handleReset = () => {
        setDescrizione('')
        setDataEvento(initialDate)
        setOraInizio(initialTime)
        setOraFine('')
    }

    const handleConferma = () => {
        if (!descrizione || !dataEvento || !oraInizio || !oraFine) return
        createEvent({
            data: {
                descrizione,
                dataEvento: dayjs(dataEvento).format('YYYY-MM-DD'),
                oraInizio,
                oraFine,
            }
        })
    }

    const isValid = !!descrizione && !!dataEvento && !!oraInizio && !!oraFine

    return (
        <Stack>
            <TextInput
                label="Descrizione"
                value={descrizione}
                onChange={e => setDescrizione(e.currentTarget.value)}
            />
            <DatePickerInput
                label="Data"
                value={dataEvento}
                onChange={(data) => setDataEvento(data && dayjs(data).isValid() ? dayjs(data).toDate() : null)}
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
                    <Button disabled={!isValid} loading={isPending} onClick={handleConferma}>
                        Crea
                    </Button>
                </Button.Group>
            </Group>
        </Stack>
    )
}
