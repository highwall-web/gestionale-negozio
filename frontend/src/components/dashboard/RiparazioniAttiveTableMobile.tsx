import { ActionIcon, Badge, Divider, Group, Loader, Paper, Stack, Text, Title, Tooltip } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getGetAttiveQueryKey, useUpdateRepair } from '../../api/endpoints/repair-controller/repair-controller'
import { RepairResponseStato } from '../../api/models/repairResponseStato'
import { UpdateRepairRequestStatoRiparazione } from '../../api/models/updateRepairRequestStatoRiparazione'
import { UpdateRepairRequestStato } from '../../api/models/updateRepairRequestStato'
import type { RepairResponse } from '../../api'
import { statoColors, statoRiparazioneColors, statoSuccessivo } from '../../utils/riparazioniUtils'

function AvanzaButton({ label, onClick, loading }: { label: string; onClick: () => void; loading: boolean }) {
    const [opened, setOpened] = useState(false)
    return (
        <Tooltip label={label} withArrow opened={opened} onMouseEnter={() => setOpened(true)} onMouseLeave={() => setOpened(false)}>
            <ActionIcon size="xs" variant="subtle" loading={loading} onClick={() => { setOpened(false); onClick() }}>
                <IconArrowRight size={14} />
            </ActionIcon>
        </Tooltip>
    )
}

function RigaInfo({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <Stack justify="space-between" gap={"xs"}>
            <Text size="xs" c="dimmed" style={{ minWidth: 120 }}>{label}</Text>
            <div>{children}</div>
        </Stack>
    )
}

interface Props {
    riparazioni: RepairResponse[]
    isLoading: boolean
}

export default function RiparazioniAttiveTableMobile({ riparazioni, isLoading }: Props) {
    const queryClient = useQueryClient()
    const { mutate: updateRepair, isPending } = useUpdateRepair({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getGetAttiveQueryKey() })
            },
        },
    })

    if (isLoading) return (
        <Paper radius={12} p="md">
            <Title order={4} mb="sm">Riparazioni attive</Title>
            <Stack align="center" py="xl"><Loader /></Stack>
        </Paper>
    )

    if (!riparazioni?.length) return (
        <Paper radius={12} p="md">
            <Title order={4} mb="sm">Riparazioni attive</Title>
            <Text c="dimmed" ta="center" py="xl">Nessuna riparazione attiva</Text>
        </Paper>
    )

    const cards = riparazioni.map((r) => {
        const prossimo = r.statoRiparazione
            ? statoSuccessivo[r.statoRiparazione as UpdateRepairRequestStatoRiparazione]
            : undefined

        const handleAvanza = () => {
            const avanzaDaStato = r.statoRiparazione === UpdateRepairRequestStatoRiparazione.ACCETTATO
                || r.statoRiparazione === UpdateRepairRequestStatoRiparazione.IN_ATTESA_DI_PREVENTIVO
            const conclusa = prossimo === UpdateRepairRequestStatoRiparazione.RIPARAZIONE_CONCLUSA
            let nuovoStato = r.stato as UpdateRepairRequestStato | undefined
            if (conclusa) nuovoStato = UpdateRepairRequestStato.PRONTO
            else if (avanzaDaStato) nuovoStato = UpdateRepairRequestStato.IN_CORSO
            updateRepair({ id: r.id, data: { customerId: r.customer.id, stato: nuovoStato, statoRiparazione: prossimo } })
        }

        return (
            <Paper key={r.id} radius="sm" withBorder p="sm">
                <Stack gap={6}>
                    <RigaInfo label="Creata il">
                        <Text size="sm">{r.createdAt ? new Intl.DateTimeFormat('it-IT', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(r.createdAt)) : '—'}</Text>
                    </RigaInfo>
                    <Divider />
                    <RigaInfo label="Cliente">
                        <Text size="sm">{r.customer.nome} {r.customer.cognome}</Text>
                    </RigaInfo>
                    <RigaInfo label="N. Telefono">
                        <Text size="sm">{r.customer.telefono}</Text>
                    </RigaInfo>
                    <RigaInfo label="Dispositivo">
                        <Text size="sm">{r.product.model.nome ?? r.product.model.id}, {r.product.color.nome}</Text>
                    </RigaInfo>
                    <Divider />
                    <RigaInfo label="Stato">
                        <Group gap={6}>
                            {r.stato ? <Badge radius="sm" color={statoColors[r.stato] ?? 'gray'}>{r.stato.replace('_', ' ')}</Badge> : '—'}
                            {r.stato === RepairResponseStato.PRONTO && (
                                <AvanzaButton
                                    label="CONSEGNATO"
                                    loading={isPending}
                                    onClick={() => updateRepair({ id: r.id, data: { customerId: r.customer.id, stato: UpdateRepairRequestStato.CONSEGNATO, statoRiparazione: r.statoRiparazione } })}
                                />
                            )}
                        </Group>
                    </RigaInfo>
                    <RigaInfo label="Stato riparazione">
                        <Group gap={6}>
                            {r.statoRiparazione ? <Badge radius="sm" color={statoRiparazioneColors[r.statoRiparazione] ?? 'gray'}>{r.statoRiparazione.replaceAll('_', ' ')}</Badge> : '—'}
                            {prossimo && <AvanzaButton label={prossimo.replaceAll('_', ' ')} loading={isPending} onClick={handleAvanza} />}
                        </Group>
                    </RigaInfo>
                    <Divider />
                    <RigaInfo label="Acconto">
                        <Text size="sm">{r.costoTotale != null ? `€ ${r.details?.acconto?.toFixed(2)}` : '—'}</Text>
                    </RigaInfo>
                    <RigaInfo label="Totale">
                        <Text size="sm">{r.costoTotale != null ? `€ ${r.costoTotale.toFixed(2)}` : '—'}</Text>
                    </RigaInfo>
                </Stack>
            </Paper>
        )
    })

    return (
        <Paper radius={12} p="md">
            <Title order={4} mb="sm">Riparazioni attive</Title>
            <Stack gap="sm">{cards}</Stack>
        </Paper>
    )
}
