import { Box, Button, Group, Paper, Stack, Text, Textarea, Title } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { getGetRepairByIdQueryKey, useAddRepairMessage, type RepairDetailsResponse } from '../../api'
import { useAuth } from '../../context/AuthContext'
import { getAxiosErrorMessage } from '../../utils/errorUtils'

interface Props {
    repairId: string
    details: RepairDetailsResponse | undefined
    isMobile?: boolean
}

export default function MessaggiRiparazione({ repairId, details, isMobile = false }: Props) {
    const { user } = useAuth()
    const [testo, setTesto] = useState('')
    const scrollRef = useRef<HTMLDivElement>(null)

    const queryClient = useQueryClient()
    const { mutate: sendMessage, isPending: isSending } = useAddRepairMessage({
        mutation: {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: getGetRepairByIdQueryKey(repairId) })
                setTesto('')
                setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' }), 100)
            },
            onError: (e) => toast.error(getAxiosErrorMessage(e)),
        }
    })

    const messaggi = [...(details?.messaggi ?? [])].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [details?.messaggi])

    const messageList = (
        <Stack gap="xs">
            {messaggi.length === 0 && (
                <Text c="dimmed" ta="center" py="xl" size="sm">Nessun messaggio</Text>
            )}
            {messaggi.map(m => {
                const isMe = m.autore === user?.username
                return (
                    <Box key={m.id} style={{ display: 'flex', padding: 0, justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                        <Box
                            style={{
                                maxWidth: '80%',
                                padding: '8px 12px',
                                borderRadius: 12,
                                backgroundColor: isMe
                                    ? 'var(--mantine-color-green-light)'
                                    : 'var(--mantine-color-blue-light)',
                            }}
                        >
                            <Text size="sm">{m.testo}</Text>
                            <Text size="xs" c="dimmed" ta={isMe ? 'right' : 'left'} mt={2}>
                                {dayjs(m.createdAt).format('DD/MM/YYYY, HH:mm')}
                            </Text>
                        </Box>
                    </Box>
                )
            })}
        </Stack>
    )

    return (
        <Paper radius={12} p="md" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
            <Stack gap="xs" style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                {!isMobile && (
                    <Title order={5}>Messaggi</Title>
                )}
                <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
                    {messageList}
                </div>

                <Textarea
                    placeholder="Scrivi un messaggio..."
                    value={testo}
                    onChange={e => setTesto(e.currentTarget.value)}
                    minRows={2}
                    autosize
                    onKeyDown={e => {
                        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && testo.trim()) {
                            sendMessage({ repairId, data: { testo } })
                        }
                    }}
                />
                <Group justify="space-between" align="center">
                    <Text size="xs" c="dimmed">
                        {!isMobile && (
                            <>Ctrl+Invio per inviare</>
                        )}
                    </Text>
                    <Button
                        disabled={!testo.trim()}
                        loading={isSending}
                        onClick={() => sendMessage({ repairId, data: { testo } })}
                    >
                        Invia
                    </Button>
                </Group>
            </Stack>
        </Paper>
    )
}
