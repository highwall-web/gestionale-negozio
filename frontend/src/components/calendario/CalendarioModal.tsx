import { Alert, Button, Checkbox, Group, Modal, Paper, ScrollArea, Stack, Text } from '@mantine/core'
import { IconInfoCircle } from '@tabler/icons-react'
import { DateTimePicker } from '@mantine/dates'
import type { RepairResponse } from '../../api'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

const MOCK_RIPARAZIONI: RepairResponse[] = [
    {
        id: 1,
        createdAt: '2026-04-01T10:00:00',
        customer: { id: 1, nome: 'Mario', cognome: 'Rossi', email: 'mario@example.com', telefono: '3331234567' },
        product: { id: 1, model: { id: 1, nome: 'Pixel 8', brandId: 1, brandNome: "Samsung", tipoDispositivo: "TELEFONO" }, color: { id: 1, nome: 'Nero' } },
    },
    {
        id: 2,
        createdAt: '2026-04-01T11:30:00',
        customer: { id: 2, nome: 'Lucia', cognome: 'Bianchi', email: 'lucia@example.com', telefono: '3479876543' },
        product: { id: 2, model: { id: 2, nome: 'Pixel 8', brandId: 1, brandNome: "Samsung", tipoDispositivo: "TELEFONO" }, color: { id: 2, nome: 'Bianco' } },
    },
    {
        id: 3,
        createdAt: '2026-04-01T14:00:00',
        customer: { id: 3, nome: 'Giulio', cognome: 'Verdi', email: 'giulio@example.com', telefono: '3209988776' },
        product: { id: 3, model: { id: 3, nome: 'Pixel 8', brandId: 1, brandNome: "Samsung", tipoDispositivo: "TELEFONO" }, color: { id: 3, nome: 'Verde' } },
    },
]

interface Props {
    opened: boolean
    onClose: () => void
    datetime: string | null
}

export default function CalendarioModal({ opened, onClose, datetime }: Props) {
    const initialDate = datetime && dayjs(datetime).isValid() ? datetime : null

    const [selected, setSelected] = useState<number | null>(null)
    const [dataRiconsegna, setDataRiconsegna] = useState<string | null>(initialDate)

    useEffect(() => {
        if (opened) {
            setSelected(null)
            setDataRiconsegna(datetime && dayjs(datetime).isValid() ? datetime : null)
        }
    }, [opened, datetime])

    const handleReset = () => {
        setSelected(null)
        setDataRiconsegna(initialDate)
    }

    const handleToggle = (id: number) => {
        setSelected(prev => prev === id ? null : id)
    }

    return (
        <Modal opened={opened} onClose={onClose} title="Inserisci data riconsegna" size="md">
            <Stack>
                <Alert icon={<IconInfoCircle size={16} />} color="blue">
                    Seleziona una riparazione e imposta la data e ora di riconsegna stimata. Sono mostrate solo le riparazioni che non hanno ancora una data di riconsegna programmata.
                </Alert>
                <ScrollArea h={200} offsetScrollbars pr="xs" style={{ border: '1px solid var(--mantine-color-default-border)', borderRadius: 'var(--mantine-radius-md)' }} p="xs">
                    <Stack gap="xs">
                        {MOCK_RIPARAZIONI.map(r => (
                            <Paper
                                key={r.id}
                                withBorder p="sm"
                                radius={"sm"}
                                onClick={() => handleToggle(r.id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <Group justify="space-between" wrap="nowrap">
                                    <Stack gap={2}>
                                        <Text fw={500}>{r.customer.nome} {r.customer.cognome}</Text>
                                        <Text size="sm" c="dimmed">{r.product.model.brandNome} {r.product.model.nome}, {r.product.color.nome}</Text>
                                    </Stack>
                                    <Checkbox
                                        checked={selected === r.id}
                                        onChange={() => handleToggle(r.id)}
                                        onClick={e => e.stopPropagation()}
                                    />
                                </Group>
                            </Paper>
                        ))}
                    </Stack>
                </ScrollArea>
                <DateTimePicker
                    label="Data e ora di riconsegna stimata"
                    value={dataRiconsegna}
                    onChange={setDataRiconsegna}
                    locale="it"
                    clearable
                />
                <Group justify="space-between">
                    <Button variant="default" onClick={handleReset}>Reset</Button>
                    <Button.Group>
                        <Button variant="default" onClick={onClose}>Annulla</Button>
                        <Button disabled={selected === null}>Conferma</Button>
                    </Button.Group>
                </Group>
            </Stack>
        </Modal>
    )
}
