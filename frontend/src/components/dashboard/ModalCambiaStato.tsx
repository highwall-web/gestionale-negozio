import { Button, Group, Modal, Select, Stack } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getGetRepairsAttiveQueryKey, StatoRepair, StatoRiparazione, useUpdateStatoRepair, type RepairResponse } from '../../api'
import toast from 'react-hot-toast'
import { statoOptions, statoRiparazioneOptions } from '../../utils/riparazioniUtils'

interface Props {
    repair: RepairResponse | null
    opened: boolean
    onClose: () => void
}

export default function CambiaStatoModal({ repair, opened, onClose }: Props) {
    const queryClient = useQueryClient()
    const [stato, setStato] = useState<string | null>(repair?.stato ?? null)
    const [statoRiparazione, setStatoRiparazione] = useState<string | null>(repair?.statoRiparazione ?? null)
    const { mutate: updateStato, isPending } = useUpdateStatoRepair({
        mutation: {
            onSuccess: () => {
                toast.success("Stato aggiornato")
                queryClient.invalidateQueries({ queryKey: getGetRepairsAttiveQueryKey() })
                onClose()
            },
        },
    })

    const unchanged = stato === (repair?.stato ?? null) && statoRiparazione === (repair?.statoRiparazione ?? null)

    const handleSubmit = () => {
        if (!repair?.id || unchanged) return
        updateStato({
            id: repair.id,
            data: {
                stato: stato as StatoRepair ?? undefined,
                statoRiparazione: statoRiparazione as StatoRiparazione ?? undefined,
            },
        })
    }

    useEffect(() => {
        if (opened) {
            setStato(repair?.stato ?? null)
            setStatoRiparazione(repair?.statoRiparazione ?? null)
        }
    }, [opened, repair])

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Cambia stato riparazione"
        >
            <Stack>
                <Select
                    label="Stato"
                    data={statoOptions}
                    value={stato}
                    onChange={setStato}
                />
                <Select
                    label="Stato riparazione"
                    data={statoRiparazioneOptions}
                    value={statoRiparazione}
                    onChange={setStatoRiparazione}
                />
                <Group mt={"sm"} justify='flex-end'>
                    <Button.Group>
                        <Button variant="default" onClick={onClose} >Annulla</Button>
                        <Button onClick={handleSubmit} loading={isPending} disabled={unchanged} >Salva</Button>
                    </Button.Group>
                </Group>
            </Stack>
        </Modal>
    )
}
