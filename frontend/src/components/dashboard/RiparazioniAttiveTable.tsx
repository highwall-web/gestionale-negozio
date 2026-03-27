import { ActionIcon, Badge, Box, Loader, Paper, Stack, Table, Text, Title, Tooltip } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getGetAttiveQueryKey, useGetAttive, useUpdateRepair } from '../../api/endpoints/repair-controller/repair-controller'
import { RepairResponseStato } from '../../api/models/repairResponseStato'
import { RepairResponseStatoRiparazione } from '../../api/models/repairResponseStatoRiparazione'
import { UpdateRepairRequestStatoRiparazione } from '../../api/models/updateRepairRequestStatoRiparazione'
import { UpdateRepairRequestStato } from '../../api/models/updateRepairRequestStato'

const statoColors: Record<string, string> = {
    [RepairResponseStato.NUOVO]: 'blue',
    [RepairResponseStato.IN_CORSO]: 'orange',
    [RepairResponseStato.PRONTO]: 'green',
    [RepairResponseStato.CONSEGNATO]: 'gray',
}

const statoRiparazioneColors: Record<string, string> = {
    [RepairResponseStatoRiparazione.ACCETTATO]: 'blue',
    [RepairResponseStatoRiparazione.ANALISI_IN_CORSO]: 'cyan',
    [RepairResponseStatoRiparazione.RIPARAZIONE_IN_CORSO]: 'orange',
    [RepairResponseStatoRiparazione.ATTESA_PEZZI_DI_RICAMBIO]: 'yellow',
    [RepairResponseStatoRiparazione.IN_ATTESA_DI_PREVENTIVO]: 'violet',
    [RepairResponseStatoRiparazione.PREVENTIVO_NON_ACCETTATO]: 'red',
    [RepairResponseStatoRiparazione.RIPARAZIONE_CONCLUSA]: 'green',
    [RepairResponseStatoRiparazione.DISPOSITIVO_NON_RIPARABILE]: 'dark',
}

function AvanzaButton({ label, onClick, loading }: { label: string; onClick: () => void; loading: boolean }) {
    const [opened, setOpened] = useState(false)
    return (
        <Tooltip label={label} withArrow opened={opened} onMouseEnter={() => setOpened(true)} onMouseLeave={() => setOpened(false)}>
            <ActionIcon
                size="xs"
                variant="subtle"
                loading={loading}
                onClick={() => { setOpened(false); onClick() }}
            >
                <IconArrowRight size={14} />
            </ActionIcon>
        </Tooltip>
    )
}

const statoSuccessivo: Partial<Record<UpdateRepairRequestStatoRiparazione, UpdateRepairRequestStatoRiparazione>> = {
    [UpdateRepairRequestStatoRiparazione.ACCETTATO]: UpdateRepairRequestStatoRiparazione.ANALISI_IN_CORSO,
    [UpdateRepairRequestStatoRiparazione.ANALISI_IN_CORSO]: UpdateRepairRequestStatoRiparazione.RIPARAZIONE_IN_CORSO,
    [UpdateRepairRequestStatoRiparazione.RIPARAZIONE_IN_CORSO]: UpdateRepairRequestStatoRiparazione.RIPARAZIONE_CONCLUSA,
    [UpdateRepairRequestStatoRiparazione.ATTESA_PEZZI_DI_RICAMBIO]: UpdateRepairRequestStatoRiparazione.RIPARAZIONE_IN_CORSO,
    [UpdateRepairRequestStatoRiparazione.IN_ATTESA_DI_PREVENTIVO]: UpdateRepairRequestStatoRiparazione.RIPARAZIONE_IN_CORSO,
}

export default function RiparazioniAttiveTable() {
    const queryClient = useQueryClient()
    const { data: riparazioni, isLoading } = useGetAttive()
    const { mutate: updateRepair, isPending } = useUpdateRepair({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getGetAttiveQueryKey() })
            },
        },
    })

    const rows = [...(riparazioni ?? [])].sort((a, b) => a.id - b.id).map((r) => {
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
            updateRepair({
                id: r.id,
                data: {
                    customerId: r.customer.id,
                    stato: nuovoStato,
                    statoRiparazione: prossimo,
                },
            })
        }

        return (
            <Table.Tr key={r.id}>
                <Table.Td>{r.customer.nome} {r.customer.cognome}</Table.Td>
                <Table.Td>{r.customer.telefono}</Table.Td>
                <Table.Td>{r.product.model.nome ?? r.product.model.id}, {r.product.color.nome}</Table.Td>
                <Table.Td>
                    <Stack gap={6} align="center" style={{ flexDirection: 'row' }}>
                        {r.stato ? (
                            <Badge color={statoColors[r.stato] ?? 'gray'}>{r.stato.replace('_', ' ')}</Badge>
                        ) : '—'}
                        {r.stato === RepairResponseStato.PRONTO && (
                            <AvanzaButton
                                label="CONSEGNATO"
                                loading={isPending}
                                onClick={() => updateRepair({
                                    id: r.id,
                                    data: {
                                        customerId: r.customer.id,
                                        stato: UpdateRepairRequestStato.CONSEGNATO,
                                        statoRiparazione: r.statoRiparazione,
                                    },
                                })}
                            />
                        )}
                    </Stack>
                </Table.Td>
                <Table.Td>
                    <Stack gap={6} align="center" style={{ flexDirection: 'row' }}>
                        {r.statoRiparazione ? (
                            <Badge color={statoRiparazioneColors[r.statoRiparazione] ?? 'gray'}>{r.statoRiparazione.replaceAll('_', ' ')}</Badge>
                        ) : '—'}
                        {prossimo && (
                            <AvanzaButton
                                label={prossimo.replaceAll('_', ' ')}
                                loading={isPending}
                                onClick={handleAvanza}
                            />
                        )}
                    </Stack>
                </Table.Td>
                <Table.Td>{r.costoTotale != null ? `€ ${r.details?.acconto?.toFixed(2)}` : '—'}</Table.Td>
                <Table.Td>{r.costoTotale != null ? `€ ${r.costoTotale.toFixed(2)}` : '—'}</Table.Td>
            </Table.Tr>
        )
    })

    return (
        <Paper radius={12} p="md">
            <Title order={4} mb="sm">Riparazioni attive</Title>
            {isLoading ? (
                <Stack align="center" py="xl">
                    <Loader />
                </Stack>
            ) : riparazioni?.length === 0 ? (
                <Text c="dimmed" ta="center" py="xl">Nessuna riparazione attiva</Text>
            ) : (
                <Box style={{ borderRadius: 'var(--mantine-radius-sm)', overflow: 'hidden' }}>
                    <Table striped highlightOnHover withTableBorder>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Cliente</Table.Th>
                                <Table.Th>N. Telefono</Table.Th>
                                <Table.Th>Dispositivo</Table.Th>
                                <Table.Th>Stato</Table.Th>
                                <Table.Th>Stato riparazione</Table.Th>
                                <Table.Th>Acconto</Table.Th>
                                <Table.Th>Totale</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Box>
            )}
        </Paper>
    )
}
