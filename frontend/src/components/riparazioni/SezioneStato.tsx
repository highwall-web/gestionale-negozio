import { Button, Group, Paper, Select, Stack, Title } from '@mantine/core'
import { useState } from 'react'
import { type RepairResponse } from '../../api'
import { statoOptions, statoRiparazioneOptions } from '../../utils/riparazioniUtils'

interface Props {
    repair: RepairResponse
}

export default function SezioneStato({ repair }: Props) {
    const [stato, setStato] = useState<string | null>(repair.stato ?? null)
    const [statoRiparazione, setStatoRiparazione] = useState<string | null>(repair.statoRiparazione ?? null)

    const unchanged = stato === (repair.stato ?? null) && statoRiparazione === (repair.statoRiparazione ?? null)

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
                    <Button disabled={unchanged}>Salva</Button>
                </Group>
            </Stack>
        </Paper>
    )
}
