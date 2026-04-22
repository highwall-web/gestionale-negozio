import { ActionIcon, Badge, Divider, Group, Loader, Paper, Popover, ScrollArea, Stack, Table, Text, Title, Tooltip, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconRefresh, IconSend2 } from '@tabler/icons-react'
import { useState } from 'react'
import { getGetRepairsAttiveQueryKey, StatoRepair, useUpdateStatoRepair, type CustomerResponse, type ProductResponse, type RepairResponse } from '../../api'
import { statoColors, statoRiparazioneColors } from '../../utils/riparazioniUtils'
import CambiaStatoModal from './ModalCambiaStato'
import PatternLock from '../PatternLock'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

function CustomerCell({ customer }: { customer: CustomerResponse }) {
    const [opened, { open, close }] = useDisclosure(false)
    return (
        <Popover position="bottom-start" withArrow shadow="md" opened={opened}>
            <Popover.Target>
                <UnstyledButton
                    onMouseEnter={open}
                    onMouseLeave={close}
                    style={{ textDecoration: 'underline dotted', cursor: 'default' }}
                >
                    {customer.nome} {customer.cognome}
                </UnstyledButton>
            </Popover.Target>
            <Popover.Dropdown style={{ pointerEvents: 'none' }}>
                <Stack gap={4}>
                    <Text fw={600} size="sm">{customer.nome} {customer.cognome}</Text>
                    <Divider />
                    <Text size="xs" c="dimmed">Email</Text>
                    <Text size="sm">{customer.email}</Text>
                    <Text size="xs" c="dimmed">Telefono</Text>
                    <Text size="sm">{customer.telefono}</Text>
                    {customer.telefonoSecondario && (
                        <>
                            <Text size="xs" c="dimmed">Telefono secondario</Text>
                            <Text size="sm">{customer.telefonoSecondario}</Text>
                        </>
                    )}
                    {(customer.indirizzo || customer.citta || customer.cap) && (
                        <>
                            <Text size="xs" c="dimmed">Indirizzo</Text>
                            <Text size="sm">
                                {[customer.indirizzo, customer.citta, customer.cap].filter(Boolean).join(', ')}
                            </Text>
                        </>
                    )}
                </Stack>
            </Popover.Dropdown>
        </Popover>
    )
}

function ProductCell({ product }: { product: ProductResponse }) {
    const [opened, { open, close }] = useDisclosure(false)
    return (
        <Popover position="bottom-start" withArrow shadow="md" opened={opened}>
            <Popover.Target>
                <UnstyledButton
                    onMouseEnter={open}
                    onMouseLeave={close}
                    style={{ textDecoration: 'underline dotted', cursor: 'default' }}
                >
                    {product.model.brandNome} {product.model.nome}, {product.color.nome}
                </UnstyledButton>
            </Popover.Target>
            <Popover.Dropdown style={{ pointerEvents: 'none' }}>
                <Stack gap={4}>
                    <Text fw={600} size="sm">{product.model.brandNome} {product.model.nome}, {product.color.nome}</Text>
                    <Divider />
                    {product.capacita && <><Text size="xs" c="dimmed">Capacità</Text><Text size="sm">{product.capacita}</Text></>}
                    {product.seriale && <><Text size="xs" c="dimmed">Seriale</Text><Text size="sm">{product.seriale}</Text></>}
                    {product.imei && <><Text size="xs" c="dimmed">IMEI</Text><Text size="sm">{product.imei}</Text></>}
                    {product.codiceModello && <><Text size="xs" c="dimmed">Codice modello</Text><Text size="sm">{product.codiceModello}</Text></>}
                    {product.pin && <><Text size="xs" c="dimmed">PIN</Text><Text size="sm">{product.pin}</Text></>}
                    {product.codiceUnlock && <><Text size="xs" c="dimmed">Codice unlock</Text><Text size="sm">{product.codiceUnlock}</Text></>}
                    {(!!product.sequenzaUnlock && product.sequenzaUnlock.length > 0) && <><Text size="xs" c="dimmed">Sequenza unlock</Text><PatternLock value={product.sequenzaUnlock} size={150} disabled /></>}
                    {product.accessori && <><Text size="xs" c="dimmed">Accessori</Text><Text size="sm">{product.accessori}</Text></>}
                    {product.contattoConLiquidi && <Text size="sm" c="red">Contatto con liquidi</Text>}
                    {product.dispositivoNonTestabile && <Text size="sm" c="orange">Dispositivo non testabile</Text>}
                    {product.acquistatoPressoDiNoi && <Text size="sm" c="teal">Acquistato presso di noi</Text>}
                    {product.lasciatoInNegozio && <Text size="sm" c="blue">Lasciato in negozio</Text>}
                </Stack>
            </Popover.Dropdown>
        </Popover>
    )
}

interface Props {
    riparazioni: RepairResponse[],
    isLoading: boolean
}

export default function RiparazioniAttiveTable({ riparazioni, isLoading }: Props) {
    const queryClient = useQueryClient()
    const [selectedRepair, setSelectedRepair] = useState<RepairResponse | null>(null)
    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false)
    const { mutate: updateStato, isPending } = useUpdateStatoRepair({
        mutation: {
            onSuccess: (res) => {
                toast.success(`Dispositivo riconsegnato il: ${res.details?.dataRiconsegnaEffettiva ? new Date(res.details.dataRiconsegnaEffettiva).toLocaleString('it-IT', { dateStyle: 'short', timeStyle: 'short' }) : '—'}`)
                queryClient.invalidateQueries({ queryKey: getGetRepairsAttiveQueryKey() })
            },
        },
    })

    function handleCambiaStato(repair: RepairResponse) {
        setSelectedRepair(repair)
        openModal()
    }

    function handleConsegna(repair: RepairResponse) {
        updateStato({
            id: repair.id,
            data: {
                stato: StatoRepair.CONSEGNATO
            }
        })
    }

    const rows = riparazioni.map((r) => {

        return (
            <Table.Tr key={r.id}>
                <Table.Td>{r.createdAt ? new Intl.DateTimeFormat('it-IT', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(r.createdAt)) : '—'}</Table.Td>
                <Table.Td>{r.details?.dataConsegna ? new Intl.DateTimeFormat('it-IT', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(r.details?.dataConsegna)) : '—'}</Table.Td>
                <Table.Td><CustomerCell customer={r.customer} /></Table.Td>
                <Table.Td><ProductCell product={r.product} /></Table.Td>
                <Table.Td style={{ whiteSpace: 'nowrap' }}>
                    <Group gap={6} align="center" justify='space-between'>
                        {r.stato ? (
                            <Badge radius="sm" color={statoColors[r.stato] ?? 'gray'}>{r.stato.replace('_', ' ')}</Badge>
                        ) : '—'}
                    </Group>
                </Table.Td>
                <Table.Td style={{ whiteSpace: 'nowrap' }}>
                    <Group gap={6} align="center" justify='space-between'>
                        {r.statoRiparazione ? (
                            <Badge radius="sm" color={statoRiparazioneColors[r.statoRiparazione] ?? 'gray'}>{r.statoRiparazione.replaceAll('_', ' ')}</Badge>
                        ) : '—'}
                    </Group>
                </Table.Td>
                <Table.Td>{r.costoTotale != null ? `€ ${r.details?.acconto?.toFixed(2)}` : '—'}</Table.Td>
                <Table.Td>{r.costoTotale != null ? `€ ${r.costoTotale.toFixed(2)}` : '—'}</Table.Td>
                <Table.Td style={{ textAlign: 'right' }}>
                    <Group gap={0} justify="flex-end">
                        <Tooltip label="Cambia stato">
                            <ActionIcon
                                variant="subtle"
                                color="var(--mantine-primary-color-filled)"
                                onClick={() => handleCambiaStato(r)}
                                loading={isPending}
                            >
                                <IconRefresh size={16} />
                            </ActionIcon>
                        </Tooltip>
                        {r.stato === StatoRepair.PRONTO && (
                            <Tooltip label="Consegna">
                                <ActionIcon
                                    variant='subtle'
                                    color="green"
                                    style={{ color: 'var(--mantine-color-green-6)' }}
                                    onClick={() => handleConsegna(r)}
                                    loading={isPending}
                                >
                                    <IconSend2 size={16} />
                                </ActionIcon>
                            </Tooltip>
                        )}
                    </Group>
                </Table.Td>
            </Table.Tr>
        )
    })

    return (
        <>
            <CambiaStatoModal
                repair={selectedRepair}
                opened={modalOpened}
                onClose={closeModal}
            />
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
                        <Table highlightOnHover style={{ minWidth: 'max-content' }}>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Creata il</Table.Th>
                                    <Table.Th>Data di consegna stimata</Table.Th>
                                    <Table.Th>Cliente</Table.Th>
                                    <Table.Th>Dispositivo</Table.Th>
                                    <Table.Th>Stato</Table.Th>
                                    <Table.Th>Stato riparazione</Table.Th>
                                    <Table.Th>Acconto</Table.Th>
                                    <Table.Th>Totale</Table.Th>
                                    <Table.Th style={{ textAlign: 'right' }}>Azioni</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                    </ScrollArea>
                )}
            </Paper>
        </>
    )
}
