import { Button, Checkbox, Group, NumberInput, ScrollArea, SimpleGrid, Stack, Switch, Text, TextInput, Title } from "@mantine/core"
import { useState } from "react"
import { register, type CreateRepairDetailsRequest, type InterventionResponse } from "../../api"
import z from "zod"
import { useForm, Controller, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { IconPlus, IconSearch } from "@tabler/icons-react"
import { useAccettazione } from "../../context/AccettazioneContext"
import { DateInput } from "@mantine/dates"
import dayjs from "dayjs"
import toast from "react-hot-toast"

const schema = z.object({
    isPreventivo: z.boolean().optional(),
    interventionIds: z.array(z.number()).optional(),
    messaggio: z.string().optional(),
    dataConsegna: z.date().nullable().optional(),
    acconto: z.number().optional()
})

type FormData = z.infer<typeof schema>


interface Props {
    onSuccess: (product: CreateRepairDetailsRequest) => void
}

export default function FormRiparazione({ onSuccess }: Props) {

    const { active, updateActive, isEditing, toggleEditingDettagli } = useAccettazione();
    const isDisabled = active !== 0;

    const [searchDispositivo, setSearchDispositivo] = useState("")
    const [searchGenerali, setSearchGenerali] = useState("")
    const [selectedDetails, setSelectedDetails] = useState<CreateRepairDetailsRequest | null>(null)

    const { register, control, reset, setValue, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            isPreventivo: false,
            interventionIds: [],
            messaggio: "",
            dataConsegna: null,
            acconto: 0
        }
    })

    const [isPreventivo] = useWatch({ control, name: ['isPreventivo'] })

    function toggleIntervento(id: number, checked: boolean, current: number[]) {
        return checked ? [...current, id] : current.filter(x => x !== id)
    }

    function handleUndo() {
        if (!selectedDetails) return;
        resetToSelected();
        onSuccess(selectedDetails);
        handleToggleEditing();
    }

    function handleToggleEditing() {
        if (!isEditing.editingDettagli) return;
        toggleEditingDettagli()
    }

    function resetToSelected() {
        if (!selectedDetails) return
        reset({
            isPreventivo: selectedDetails.isPreventivo ?? false,
            interventionIds: selectedDetails.interventionIds ?? [],
            messaggio: selectedDetails.messaggi?.at(0)?.testo ?? "",
            dataConsegna: selectedDetails.dataConsegna ? dayjs(selectedDetails.dataConsegna).toDate() : null,
            acconto: selectedDetails.acconto ?? 0
        })
    }

    function handleReset() {
        reset({
            isPreventivo: false,
            interventionIds: [],
            messaggio: "",
            dataConsegna: null,
            acconto: 0
        })
        if (!isEditing.editingDispositivo) {
            setSelectedDetails(null)
        }
    }

    function onSubmit(data: FormData) {
        if (selectedDetails && isEditing.editingDettagli) {
            resetToSelected()
            toggleEditingDettagli()
            onSuccess(selectedDetails)
            return
        }
        if (selectedDetails) {
            onSuccess(selectedDetails);
            return;
        }
        createDetails(data);
    }

    function createDetails(data: FormData) {
        const details: CreateRepairDetailsRequest = {
            isPreventivo: data.isPreventivo,
            interventionIds: data.interventionIds,
            messaggi: data.messaggio ? [{ testo: data.messaggio }] : [],
            dataConsegna: data.dataConsegna ? dayjs(data.dataConsegna).format('YYYY-MM-DD') : undefined,
            acconto: data.acconto
        }
        toast.success("Dettagli inseriti")
        setSelectedDetails(details)
        onSuccess(details)
        handleToggleEditing();
    }

    function InterventoCard({ i, field }: { i: InterventionResponse, field: { value?: number[], onChange: (v: number[]) => void } }) {
        const checked = field.value?.includes(i.id) ?? false
        return (
            <Checkbox.Card
                checked={checked}
                onClick={() => field.onChange(toggleIntervento(i.id, !checked, field.value ?? []))}
                radius="md"
                p="sm"
            >
                <Group wrap="nowrap" align="center">
                    <Checkbox.Indicator />
                    <Group justify="space-between" style={{ flex: 1 }}>
                        <Group gap="xs" align="baseline">
                            <Text size="sm" fw={500}>{i.nome}</Text>
                            <Text size="xs" c="dimmed">€{i.prezzo}</Text>
                        </Group>
                        {!!i.periodoGaranzia && (
                            <Text size="xs" c="dimmed">{i.periodoGaranzia} Mesi</Text>
                        )}
                    </Group>
                </Group>
            </Checkbox.Card>
        )
    }

    function InterventoList({ items, search, field }: {
        items: InterventionResponse[],
        search: string,
        field: { value?: number[], onChange: (v: number[]) => void }
    }) {
        const filtered = items.filter(i => i.nome.toLowerCase().includes(search.toLowerCase()))
        return (
            <ScrollArea h={160}>
                <Stack gap="xs" pr="xs">
                    {filtered.length > 0
                        ? filtered.map(i => <InterventoCard key={i.id} i={i} field={field} />)
                        : <Text size="sm" c="dimmed" ta="center" mt="md">Nessun risultato</Text>
                    }
                </Stack>
            </ScrollArea>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Title order={4} mb={"md"}>Dettagli riparazione</Title>
            <Group justify="space-between">
                <Controller
                    name="isPreventivo"
                    control={control}
                    render={({ field }) => (
                        <Group gap="sm" style={{ width: 'fit-content' }}>
                            <Switch
                                size="md"
                                checked={field.value ?? false}
                                onChange={e => {
                                    field.onChange(e.currentTarget.checked)
                                    if (e.currentTarget.checked) setValue('interventionIds', [])
                                }}
                            />
                            <Text size="md">È un preventivo?</Text>
                        </Group>
                    )}
                />
                {!isPreventivo && (
                    <Button size="sm" variant="light" leftSection={<IconPlus size={16} />}>
                        Aggiungi intervento
                    </Button>
                )}
            </Group>

            {!isPreventivo && (
                <Controller
                    name="interventionIds"
                    control={control}
                    render={({ field }) => (
                        <SimpleGrid cols={{ base: 1, sm: 2 }} mt={"md"}>
                            <Stack gap="xs">
                                <Text fw={600} size="sm">Interventi dispositivo</Text>
                                <TextInput
                                    placeholder="Cerca..."
                                    size="sm"
                                    leftSection={<IconSearch size={14} />}
                                    value={searchDispositivo}
                                    onChange={e => setSearchDispositivo(e.currentTarget.value)}
                                />
                                <InterventoList items={[]} search={searchDispositivo} field={field} />
                            </Stack>

                            <Stack gap="xs">
                                <Text fw={600} size="sm">Interventi generali</Text>
                                <TextInput
                                    placeholder="Cerca..."
                                    size="sm"
                                    leftSection={<IconSearch size={14} />}
                                    value={searchGenerali}
                                    onChange={e => setSearchGenerali(e.currentTarget.value)}
                                />
                                <InterventoList items={[]} search={searchGenerali} field={field} />
                            </Stack>
                        </SimpleGrid>
                    )}
                />
            )}
            <SimpleGrid cols={{ base: 1, sm: 2 }} mt={"md"}>
                <TextInput
                    label="Commenti accettazione"
                    error={errors.messaggio?.message}
                    disabled={isDisabled}
                    {...register('messaggio')}
                />
                <Controller
                    name="dataConsegna"
                    control={control}
                    render={({ field }) => (
                        <DateInput
                            label="Data stimata di riconsegna"
                            value={field.value ?? null}
                            onChange={field.onChange}
                            error={errors.dataConsegna?.message}
                            minDate={new Date()}
                            valueFormat="DD/MM/YYYY"
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
                            error={errors.acconto?.message}
                        />
                    )}
                />
            </SimpleGrid>
            <Button.Group mt="xl">
                {active === 0 && (
                    <>
                        {
                            !isEditing.editingDispositivo ? (
                                <Button
                                    type={"submit"}
                                >
                                    {selectedDetails ? 'Usa questi dettagli' : 'Conferma dettagli'}
                                </Button>
                            ) : (
                                <Button
                                    type={"button"}
                                    onClick={(e) => { e.preventDefault(); handleUndo() }}
                                >
                                    Annulla modifiche
                                </Button>
                            )
                        }
                        {
                            !!selectedDetails && (
                                <Button type="submit" variant="outline">
                                    {'Modifica dettagli inseriti'}
                                </Button>
                            )
                        }
                        <Button variant="default" type="button" onClick={handleReset}>
                            Reset
                        </Button>
                    </>
                )}
                {(isDisabled && !!selectedDetails) && (
                    <Button type='button' onClick={(e) => { e.preventDefault(); updateActive(1); toggleEditingDettagli() }}>
                        Modifica dettagli
                    </Button>
                )}
            </Button.Group>
        </form>
    )
}
