import { Button, Group, Modal, Select, Stack } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import type { RepairResponse } from '../../api'
import { getGetAttiveQueryKey, useUpdateStatoRepair } from '../../api/endpoints/repair-controller/repair-controller'
import { UpdateStatoRepairRequestStato } from '../../api/models/updateStatoRepairRequestStato'
import { UpdateStatoRepairRequestStatoRiparazione } from '../../api/models/updateStatoRepairRequestStatoRiparazione'

interface Props {
    repair: RepairResponse | null
    opened: boolean
    onClose: () => void
}

const statoOptions = [
    { value: UpdateStatoRepairRequestStato.NUOVO, label: 'Nuovo' },
    { value: UpdateStatoRepairRequestStato.IN_CORSO, label: 'In corso' },
    { value: UpdateStatoRepairRequestStato.PRONTO, label: 'Pronto' },
    { value: UpdateStatoRepairRequestStato.CONSEGNATO, label: 'Consegnato' },
]

const statoRiparazioneOptions = [
    { value: UpdateStatoRepairRequestStatoRiparazione.ACCETTATO, label: 'Accettato' },
    { value: UpdateStatoRepairRequestStatoRiparazione.ANALISI_IN_CORSO, label: 'Analisi in corso' },
    { value: UpdateStatoRepairRequestStatoRiparazione.RIPARAZIONE_IN_CORSO, label: 'Riparazione in corso' },
    { value: UpdateStatoRepairRequestStatoRiparazione.ATTESA_PEZZI_DI_RICAMBIO, label: 'Attesa pezzi di ricambio' },
    { value: UpdateStatoRepairRequestStatoRiparazione.IN_ATTESA_DI_PREVENTIVO, label: 'In attesa di preventivo' },
    { value: UpdateStatoRepairRequestStatoRiparazione.PREVENTIVO_NON_ACCETTATO, label: 'Preventivo non accettato' },
    { value: UpdateStatoRepairRequestStatoRiparazione.RIPARAZIONE_CONCLUSA, label: 'Riparazione conclusa' },
    { value: UpdateStatoRepairRequestStatoRiparazione.DISPOSITIVO_NON_RIPARABILE, label: 'Dispositivo non riparabile' },
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
                queryClient.invalidateQueries({ queryKey: getGetAttiveQueryKey() })
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
                stato: stato as UpdateStatoRepairRequestStato ?? undefined,
                statoRiparazione: statoRiparazione as UpdateStatoRepairRequestStatoRiparazione ?? undefined,
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
