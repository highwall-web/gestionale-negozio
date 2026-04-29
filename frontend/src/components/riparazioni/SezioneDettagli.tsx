import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Checkbox, Group, NumberInput, Paper, ScrollArea, SimpleGrid, Stack, Switch, Text, TextInput, Title } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useQueryClient } from '@tanstack/react-query'
import { IconSearch } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import {
    getGetRepairByIdQueryKey,
    useGetInterventiGenerali,
    useGetInterventionsByModel,
    useUpdateRepairDetails,
    type InterventionQuantitaRequest,
    type InterventionResponse,
    type RepairResponse,
} from '../../api'

const schema = z.object({
    isPreventivo: z.boolean(),
    dataConsegna: z.string().nullable().optional(),
    acconto: z.number().optional(),
    interventi: z.array(z.object({ interventionId: z.number(), quantita: z.number() })),
})

type FormData = z.infer<typeof schema>

interface Props {
    repair: RepairResponse
}

function InterventoCard({
    intervento,
    value,
    onChange,
    removed,
}: {
    intervento: InterventionResponse
    value: InterventionQuantitaRequest[]
    onChange: (v: InterventionQuantitaRequest[]) => void
    removed?: boolean
}) {
    const checked = value.some(x => x.interventionId === intervento.id)
    return (
        <Checkbox.Card
            component="div"
            checked={checked}
            onClick={() => {
                onChange(
                    checked
                        ? value.filter(x => x.interventionId !== intervento.id)
                        : [...value, { interventionId: intervento.id, quantita: 1 }]
                )
            }}
            px="xs"
            style={{ height: 36 }}
        >
            <Group wrap="nowrap" align="center" h="100%">
                <Checkbox.Indicator />
                <Group justify="space-between" style={{ flex: 1 }}>
                    <Group gap="xs" align="baseline">
                        <Text size="sm" fw={500} td={removed ? 'line-through' : undefined} c={removed ? 'dimmed' : undefined}>{intervento.nome}</Text>
                        <Text size="xs" c="dimmed">€{intervento.prezzo.toFixed(2)}</Text>
                        {removed && <Text size="xs" c="orange">eliminato</Text>}
                    </Group>
                    {!!intervento.periodoGaranzia && (
                        <Text size="xs" c="dimmed">{intervento.periodoGaranzia} mesi</Text>
                    )}
                </Group>
            </Group>
        </Checkbox.Card>
    )
}

export default function SezioneDettagli({ repair }: Props) {
    const modelId = repair.product.model.id
    const details = repair.details

    const { data: interventiModelloRaw = [] } = useGetInterventionsByModel(modelId)
    const { data: interventiGeneraliRaw = [] } = useGetInterventiGenerali()

    // Interventi salvati che non compaiono nelle liste correnti (es. intervento rimosso o cambiato modello)
    const savedExtra = (details?.interventi ?? [])
        .filter(s => ![...interventiModelloRaw, ...interventiGeneraliRaw].some(i => i.id === s.interventionId))
        .map(s => ({ id: s.interventionId, nome: s.nome, prezzo: s.prezzo, periodoGaranzia: s.periodoGaranzia, modelId: s.modelId }))

    const savedExtraIds = new Set(savedExtra.map(s => s.id))
    const interventiModello = [...interventiModelloRaw, ...savedExtra.filter(s => s.modelId != null)]
    const interventiGenerali = [...interventiGeneraliRaw, ...savedExtra.filter(s => s.modelId == null)]

    const [searchModello, setSearchModello] = useState('')
    const [searchGenerali, setSearchGenerali] = useState('')

    const queryClient = useQueryClient()
    const { mutate: updateDetails, isPending } = useUpdateRepairDetails({
        mutation: {
            onSuccess: () => {
                toast.success('Dettagli aggiornati')
                queryClient.invalidateQueries({ queryKey: getGetRepairByIdQueryKey(repair.id) })
            },
            onError: () => toast.error('Errore durante il salvataggio'),
        }
    })

    const { control, reset, handleSubmit, setValue, formState: { isDirty } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            isPreventivo: details?.isPreventivo ?? false,
            dataConsegna: details?.dataConsegna ?? null,
            acconto: details?.acconto ?? 0,
            interventi: details?.interventi.map(i => ({ interventionId: i.interventionId, quantita: i.quantita })) ?? [],
        },
    })

    useEffect(() => {
        reset({
            isPreventivo: details?.isPreventivo ?? false,
            dataConsegna: details?.dataConsegna ?? null,
            acconto: details?.acconto ?? 0,
            interventi: details?.interventi.map(i => ({ interventionId: i.interventionId, quantita: i.quantita })) ?? [],
        })
    }, [details])

    const [isPreventivo, interventi] = useWatch({ control, name: ['isPreventivo', 'interventi'] })

    const onSubmit = (data: FormData) => {
        updateDetails({
            repairId: repair.id,
            data: {
                isPreventivo: data.isPreventivo,
                interventi: data.interventi,
                dataConsegna: data.dataConsegna ?? undefined,
                acconto: data.acconto,
            }
        })
    }

    return (
        <Paper radius={12} p="md" h="100%">
            <form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Stack gap="sm" style={{ flex: 1 }}>
                    <Title order={5}>Dettagli</Title>

                    <Controller
                        name="isPreventivo"
                        control={control}
                        render={({ field }) => (
                            <Switch
                                label="È un preventivo"
                                checked={field.value}
                                onChange={e => {
                                    field.onChange(e.currentTarget.checked)
                                    if (e.currentTarget.checked) setValue('interventi', [])
                                }}
                            />
                        )}
                    />

                    {!isPreventivo && (
                        <Controller
                            name="interventi"
                            control={control}
                            render={({ field }) => (
                                <SimpleGrid cols={{ base: 1, sm: 1 }} spacing="xs">
                                    <Stack gap="xs">
                                        <Text size="sm" fw={600}>Interventi per modello</Text>
                                        <TextInput
                                            placeholder="Cerca..."
                                            size="sm"
                                            leftSection={<IconSearch size={14} />}
                                            value={searchModello}
                                            onChange={e => setSearchModello(e.currentTarget.value)}
                                        />
                                        <ScrollArea h={160}>
                                            <Stack gap="xs" pr="xs">
                                                {interventiModello
                                                    .filter(i => i.nome.toLowerCase().includes(searchModello.toLowerCase()))
                                                    .map(i => (
                                                        <InterventoCard
                                                            key={i.id}
                                                            intervento={i}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            removed={savedExtraIds.has(i.id)}
                                                        />
                                                    ))
                                                }
                                                {interventiModello.length === 0 && (
                                                    <Text size="sm" c="dimmed" ta="center" mt="md">Nessun intervento per questo modello</Text>
                                                )}
                                            </Stack>
                                        </ScrollArea>
                                    </Stack>
                                    <Stack gap="xs">
                                        <Text size="sm" fw={600}>Interventi generali</Text>
                                        <TextInput
                                            placeholder="Cerca..."
                                            size="sm"
                                            leftSection={<IconSearch size={14} />}
                                            value={searchGenerali}
                                            onChange={e => setSearchGenerali(e.currentTarget.value)}
                                        />
                                        <ScrollArea h={160}>
                                            <Stack gap="xs" pr="xs">
                                                {interventiGenerali
                                                    .filter(i => i.nome.toLowerCase().includes(searchGenerali.toLowerCase()))
                                                    .map(i => (
                                                        <InterventoCard
                                                            key={i.id}
                                                            intervento={i}
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                            removed={savedExtraIds.has(i.id)}
                                                        />
                                                    ))
                                                }
                                                {interventiGenerali.length === 0 && (
                                                    <Text size="sm" c="dimmed" ta="center" mt="md">Nessun intervento generale</Text>
                                                )}
                                            </Stack>
                                        </ScrollArea>
                                    </Stack>
                                </SimpleGrid>
                            )}
                        />
                    )}

                    <SimpleGrid cols={{ base: 1, sm: 1 }} spacing="xs">
                        <Controller
                            name="dataConsegna"
                            control={control}
                            render={({ field }) => (
                                <DateTimePicker
                                    label="Data stimata di riconsegna"
                                    value={field.value ?? null}
                                    onChange={field.onChange}
                                    valueFormat="DD/MM/YYYY HH:mm"
                                    clearable
                                />
                            )}
                        />
                        <Controller
                            name="acconto"
                            control={control}
                            render={({ field }) => (
                                <NumberInput
                                    label="Acconto"
                                    min={0}
                                    prefix="€ "
                                    decimalScale={2}
                                    fixedDecimalScale
                                    value={field.value ?? 0}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </SimpleGrid>
                    <Group mt="auto">
                        {!isPreventivo && (interventi?.length ?? 0) > 0 && (
                            <Text size="sm" c="dimmed">
                                Totale interventi: <Text span fw={600} c="var(--mantine-color-text)">
                                    € {[...interventiModello, ...interventiGenerali]
                                        .filter(i => interventi?.some(x => x.interventionId === i.id))
                                        .reduce((acc, i) => acc + i.prezzo, 0)
                                        .toFixed(2)}
                                </Text>
                            </Text>
                        )}
                        <Group gap="xs" ms="auto">
                            <Button variant="light" color="red" type="button" disabled={!isDirty} onClick={() => reset()}>Reset</Button>
                            <Button type="submit" disabled={!isDirty} loading={isPending}>Salva</Button>
                        </Group>
                    </Group>
                </Stack>
            </form>
        </Paper>
    )
}
