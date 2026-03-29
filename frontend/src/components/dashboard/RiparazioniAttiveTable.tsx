import { ActionIcon, Badge, Loader, Paper, ScrollArea, Stack, Table, Text, Title, Tooltip } from '@mantine/core'
import { IconArrowRight } from '@tabler/icons-react'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import type { RepairResponse } from '../../api'
import { getGetAttiveQueryKey, useUpdateRepair } from '../../api/endpoints/repair-controller/repair-controller'
import { RepairResponseStato } from '../../api/models/repairResponseStato'
import { UpdateRepairRequestStato } from '../../api/models/updateRepairRequestStato'
import { UpdateRepairRequestStatoRiparazione } from '../../api/models/updateRepairRequestStatoRiparazione'
import { statoColors, statoRiparazioneColors, statoSuccessivo } from '../../utils/riparazioniUtils'

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


interface Props {
    riparazioni: RepairResponse[],
    isLoading: boolean
}

export default function RiparazioniAttiveTable({ riparazioni, isLoading }: Props) {
    const queryClient = useQueryClient()
    const { mutate: updateRepair, isPending } = useUpdateRepair({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getGetAttiveQueryKey() })
            },
        },
    })

    const rows = riparazioni.map((r) => {
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
                <Table.Td>{r.createdAt ? new Intl.DateTimeFormat('it-IT', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(r.createdAt)) : '—'}</Table.Td>
                <Table.Td>{r.customer.nome} {r.customer.cognome}</Table.Td>
                <Table.Td>{r.customer.telefono}</Table.Td>
                <Table.Td>{r.product.model.nome ?? r.product.model.id}, {r.product.color.nome}</Table.Td>
                <Table.Td style={{ whiteSpace: 'nowrap' }}>
                    <Stack gap={6} align="center" style={{ flexDirection: 'row' }}>
                        {r.stato ? (
                            <Badge radius="sm" color={statoColors[r.stato] ?? 'gray'}>{r.stato.replace('_', ' ')}</Badge>
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
                <Table.Td style={{ whiteSpace: 'nowrap' }}>
                    <Stack gap={6} align="center" style={{ flexDirection: 'row' }}>
                        {r.statoRiparazione ? (
                            <Badge radius="sm" color={statoRiparazioneColors[r.statoRiparazione] ?? 'gray'}>{r.statoRiparazione.replaceAll('_', ' ')}</Badge>
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
                <ScrollArea>
                    <Table striped highlightOnHover withTableBorder style={{ minWidth: 'max-content' }}>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Creata il</Table.Th>
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
                </ScrollArea>
            )}
        </Paper>
    )
}
