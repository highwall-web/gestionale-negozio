import { Badge, Group, Loader, Paper, ScrollArea, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconClock } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { type RepairResponse } from '../../api'

interface AvvisoItemProps {
    label: string
    sublabel: string
}

function AvvisoItem({ label, sublabel }: AvvisoItemProps) {
    return (
        <Group gap={10} wrap="nowrap">
            <ThemeIcon color="orange" variant="light" size={32} radius="sm" style={{ flexShrink: 0 }}>
                <IconClock size={14} />
            </ThemeIcon>
            <Stack gap={0}>
                <Text size="sm" fw={500} lineClamp={1}>{label}</Text>
                <Text size="xs" c="dimmed">{sublabel}</Text>
            </Stack>
        </Group>
    )
}

interface Props {
    riparazioni: RepairResponse[]
    isLoading: boolean
}

export default function Avvisi({ riparazioni, isLoading }: Props) {
    const [now, setNow] = useState(() => dayjs())

    useEffect(() => {
        const id = setInterval(() => setNow(dayjs()), 60_000)
        return () => clearInterval(id)
    }, [])

    const daConsegnareOggi = riparazioni.filter(r => {
        if (!r.details?.dataConsegna) return false
        return dayjs(r.details.dataConsegna).isSame(now, 'day')
    })

    return (
        <Paper radius={12} p="md" h="100%">
            <Group justify="space-between" mb="sm">
                <Title order={4}>Avvisi</Title>
                {daConsegnareOggi.length > 0 && <Badge color="orange" variant="filled">{daConsegnareOggi.length}</Badge>}
            </Group>
            {isLoading ? (
                <Stack align="center" justify="center" h={70}>
                    <Loader size="sm" />
                </Stack>
            ) : daConsegnareOggi.length === 0 ? (
                <Stack align="center" justify="center" h={70}>
                    <Text c="dimmed" size="sm">Nessun avviso</Text>
                </Stack>
            ) : (
                <ScrollArea h={70}>
                    <Stack gap={'xs'}>
                        {daConsegnareOggi.map(r => (
                            <AvvisoItem
                                key={r.id}
                                label={`${r.customer.nome} ${r.customer.cognome} — ${r.product.model.brandNome} ${r.product.model.nome}`}
                                sublabel={`Consegna prevista oggi alle ${dayjs(r.details?.dataConsegna).format('HH:mm')}`}
                            />
                        ))}
                    </Stack>
                </ScrollArea>
            )}
        </Paper>
    )
}
