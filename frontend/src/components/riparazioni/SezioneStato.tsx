import { Button, Group, Paper, Select, Stack, Title } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { getGetRepairByIdQueryKey, StatoRepair, StatoRiparazione, useUpdateStatoRepair, type RepairResponse } from '../../api'
import { statoOptions, statoRiparazioneOptions } from '../../utils/riparazioniUtils'

interface Props {
    repair: RepairResponse
}

export default function SezioneStato({ repair }: Props) {
    const [stato, setStato] = useState<StatoRepair | null>(repair.stato ?? null)
    const [statoRiparazione, setStatoRiparazione] = useState<StatoRiparazione | null>(repair.statoRiparazione ?? null)

    const unchanged = stato === (repair.stato ?? null) && statoRiparazione === (repair.statoRiparazione ?? null)

    const queryClient = useQueryClient()
    const { mutate: updateStato, isPending } = useUpdateStatoRepair({
        mutation: {
            onSuccess: () => {
                toast.success('Stato aggiornato')
                queryClient.invalidateQueries({ queryKey: getGetRepairByIdQueryKey(repair.id) })
            },
            onError: () => toast.error('Errore durante il salvataggio'),
        }
    })

    return (
        <Paper radius={12} p="md">
            <Stack gap="sm">
                <Title order={5}>Stato</Title>
                <Stack gap="xs">
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
                </Stack>
                <Group justify="flex-end" gap="xs">
                    <Button variant="light" color="red" disabled={unchanged} onClick={() => { setStato(repair.stato ?? null); setStatoRiparazione(repair.statoRiparazione ?? null) }}>Reset</Button>
                    <Button
                        disabled={unchanged}
                        loading={isPending}
                        onClick={() => updateStato({ id: repair.id, data: { stato: stato ?? undefined, statoRiparazione: statoRiparazione ?? undefined } })}
                    >
                        Salva
                    </Button>
                </Group>
            </Stack>
        </Paper>
    )
}
