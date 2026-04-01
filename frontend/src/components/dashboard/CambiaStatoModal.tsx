import { Button, Group, Modal, Select, Stack } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { getGetRepairsAttiveQueryKey, StatoRepair, StatoRiparazione, useUpdateStatoRepair, type RepairResponse } from '../../api'

interface Props {
    repair: RepairResponse | null
    opened: boolean
    onClose: () => void
}

const statoOptions = [
    { value: StatoRepair.NUOVO, label: 'Nuovo' },
    { value: StatoRepair.IN_CORSO, label: 'In corso' },
    { value: StatoRepair.PRONTO, label: 'Pronto' },
    { value: StatoRepair.CONSEGNATO, label: 'Consegnato' },
]

const statoRiparazioneOptions = [
    { value: StatoRiparazione.ACCETTATO, label: 'Accettato' },
    { value: StatoRiparazione.ANALISI_IN_CORSO, label: 'Analisi in corso' },
    { value: StatoRiparazione.RIPARAZIONE_IN_CORSO, label: 'Riparazione in corso' },
    { value: StatoRiparazione.ATTESA_PEZZI_DI_RICAMBIO, label: 'Attesa pezzi di ricambio' },
    { value: StatoRiparazione.IN_ATTESA_DI_PREVENTIVO, label: 'In attesa di preventivo' },
    { value: StatoRiparazione.PREVENTIVO_NON_ACCETTATO, label: 'Preventivo non accettato' },
    { value: StatoRiparazione.RIPARAZIONE_CONCLUSA, label: 'Riparazione conclusa' },
    { value: StatoRiparazione.DISPOSITIVO_NON_RIPARABILE, label: 'Dispositivo non riparabile' },
]

export default function CambiaStatoModal({ repair, opened, onClose }: Props) {
    const queryClient = useQueryClient()
    const [stato, setStato] = useState<string | null>(repair?.stato ?? null)
    const [statoRiparazione, setStatoRiparazione] = useState<string | null>(repair?.statoRiparazione ?? null)

    useEffect(() => {
        if (opened) {
            setStato(repair?.stato ?? null)
            setStatoRiparazione(repair?.statoRiparazione ?? null)
        }
    }, [opened, repair])

    const { mutate: updateStato, isPending } = useUpdateStatoRepair({
        mutation: {
            onSuccess: () => {
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

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Cambia stato riparazione"
            centered
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
                <Group justify="flex-end" mt="sm">
                    <Button variant="default" onClick={onClose}>Annulla</Button>
                    <Button onClick={handleSubmit} loading={isPending} disabled={unchanged}>Salva</Button>
                </Group>
            </Stack>
        </Modal>
    )
}
