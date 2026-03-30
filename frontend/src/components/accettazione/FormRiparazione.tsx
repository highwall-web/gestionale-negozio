import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Checkbox, Group, NumberInput, ScrollArea, SimpleGrid, Stack, Switch, Text, TextInput, Title } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { DateInput } from "@mantine/dates"
import { IconPlus, IconSearch } from "@tabler/icons-react"
import { useState } from "react"
import { useResetOnEditEnd } from '../../hooks/useResetOnEditEnd'
import { Controller, useForm, useWatch } from "react-hook-form"
import toast from "react-hot-toast"
import z from "zod"
import { type CreateRepairDetailsRequest, type InterventionQuantitaRequest, type InterventionResponse } from "../../api"
import { useAccettazione } from "../../context/AccettazioneContext"
import ModalAggiungiIntervento from "./ModalAggiungiIntervento"

const schema = z.object({
    isPreventivo: z.boolean().optional(),
    interventi: z.array(z.object({ interventionId: z.number(), quantita: z.number().optional() })).optional(),
    messaggio: z.string().optional(),
    dataConsegna: z.string().nullable().optional(),
    acconto: z.number().optional()
})

type FormData = z.infer<typeof schema>


interface Props {
    onSuccess: (product: CreateRepairDetailsRequest) => void
}

export default function FormRiparazione({ onSuccess }: Props) {

    const { active, updateActive, isEditing, toggleEditingDettagli, selectedModel, interventiGenerali, interventiPerModello } = useAccettazione();
    const isDisabled = active !== 2;

    const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false)
    const [searchDispositivo, setSearchDispositivo] = useState("")
    const [searchGenerali, setSearchGenerali] = useState("")
    const [selectedDetails, setSelectedDetails] = useState<CreateRepairDetailsRequest | null>(null)
    const [isEditable, setIsEditable] = useState(false);


    const { register, control, reset, setValue, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            isPreventivo: false,
            interventi: [],
            messaggio: "",
            dataConsegna: null,
            acconto: 0
        }
    })

    const [isPreventivo] = useWatch({ control, name: ['isPreventivo'] })

    function toggleIntervento(id: number, checked: boolean, current: InterventionQuantitaRequest[]) {
        return checked ? [...current, { interventionId: id, quantita: 1 }] : current.filter(x => x.interventionId !== id)
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
            interventi: selectedDetails.interventi ?? [],
            messaggio: selectedDetails.messaggi?.at(0)?.testo ?? "",
            dataConsegna: selectedDetails.dataConsegna ?? null,
            acconto: selectedDetails.acconto ?? 0
        })
    }

    function handleReset() {
        reset({
            isPreventivo: false,
            interventi: [],
            messaggio: "",
            dataConsegna: null,
            acconto: 0
        })
        if (!isEditing.editingDettagli) {
            setSelectedDetails(null)
        }
    }

    function onSubmit(data: FormData) {
        setIsEditable(true);
        createDetails(data);
    }

    function createDetails(data: FormData) {
        const details: CreateRepairDetailsRequest = {
            isPreventivo: data.isPreventivo,
            interventi: data.interventi,
            messaggi: data.messaggio ? [{ testo: data.messaggio }] : [],
            dataConsegna: data.dataConsegna ?? undefined,
            acconto: data.acconto
        }
        toast.success("Dettagli inseriti")
        setSelectedDetails(details)
        onSuccess(details)
        handleToggleEditing();
    }

    function InterventoCard({ i, field }: { i: InterventionResponse, field: { value?: InterventionQuantitaRequest[], onChange: (v: InterventionQuantitaRequest[]) => void } }) {
        const checked = field.value?.some(x => x.interventionId === i.id) ?? false

        return (
            <Group gap={0}>
                <Checkbox.Card
                    component="div"
                    checked={checked}
                    onClick={() => { if (!isDisabled) field.onChange(toggleIntervento(i.id, !checked, field.value ?? [])) }}
                    radius="sm"
                    disabled={isDisabled}
                    style={{ flex: 1, height: 36 }}
                    px="xs"
                >
                    <Group wrap="nowrap" align="center" h="100%">
                        <Checkbox.Indicator disabled={isDisabled} />
                        <Group justify="space-between" style={{ flex: 1 }}>
                            <Group gap="xs" align="baseline">
                                <Text size="sm" fw={500}>{i.nome}</Text>
                                <Text size="xs" c="dimmed">€{i.prezzo}</Text>
                            </Group>
                            <Group gap="xs" align="baseline">
                                {!!i.periodoGaranzia && (
                                    <Text size="xs" c="dimmed">{i.periodoGaranzia} Mesi</Text>
                                )}
                            </Group>
                        </Group>
                    </Group>
                </Checkbox.Card>
            </Group>
        )
    }

    function InterventoList({ items, search, field }: {
        items: InterventionResponse[],
        search: string,
        field: { value?: InterventionQuantitaRequest[], onChange: (v: InterventionQuantitaRequest[]) => void }
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

    useResetOnEditEnd(isEditing.editingDettagli, resetToSelected)

    return (
        <>
            <ModalAggiungiIntervento
                opened={modalOpened}
                onClose={closeModal}
                onSuccess={() => closeModal()}
                model={selectedModel}
            />
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
                                        if (e.currentTarget.checked) setValue('interventi', [])
                                    }}
                                    disabled={isDisabled}
                                />
                                <Text size="md">È un preventivo?</Text>
                            </Group>
                        )}
                        disabled={isDisabled}
                    />
                    {(!isPreventivo && !isDisabled) && (
                        <Button size="sm" variant="light" leftSection={<IconPlus size={16} />} onClick={openModal}>
                            Aggiungi intervento
                        </Button>
                    )}
                </Group>

                {!isPreventivo && (
                    <Controller
                        name="interventi"
                        control={control}
                        render={({ field }) => {
                            const typedField = field as { value?: InterventionQuantitaRequest[], onChange: (v: InterventionQuantitaRequest[]) => void }
                            return (
                                <SimpleGrid cols={{ base: 1, sm: 2 }} mt={"md"}>
                                    <Stack gap="xs">
                                        <Text fw={600} size="sm">Interventi dispositivo</Text>
                                        <TextInput
                                            placeholder="Cerca..."
                                            size="sm"
                                            leftSection={<IconSearch size={14} />}
                                            value={searchDispositivo}
                                            onChange={e => setSearchDispositivo(e.currentTarget.value)}
                                            disabled={isDisabled}
                                        />
                                        <InterventoList items={interventiPerModello} search={searchDispositivo} field={typedField} />
                                    </Stack>

                                    <Stack gap="xs">
                                        <Text fw={600} size="sm">Interventi generali</Text>
                                        <TextInput
                                            placeholder="Cerca..."
                                            size="sm"
                                            leftSection={<IconSearch size={14} />}
                                            value={searchGenerali}
                                            onChange={e => setSearchGenerali(e.currentTarget.value)}
                                            disabled={isDisabled}
                                        />
                                        <InterventoList items={interventiGenerali} search={searchGenerali} field={typedField} />
                                    </Stack>
                                </SimpleGrid>
                            )
                        }}
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
                                value={field.value}
                                onChange={field.onChange}
                                error={errors.dataConsegna?.message}
                                minDate={new Date()}
                                valueFormat="DD/MM/YYYY"
                                disabled={isDisabled}
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
                                disabled={isDisabled}
                                error={errors.acconto?.message}
                            />
                        )}
                    />
                </SimpleGrid>
                <Group justify="flex-end" mt="xl">
                    <Button.Group>
                        {active === 2 && (
                            <>
                                <Button variant="default" type="button" onClick={handleReset}>
                                    Reset
                                </Button>
                                {
                                    !isEditing.editingDettagli ? (
                                        <Button
                                            type={"submit"}
                                        >
                                            {selectedDetails ? 'Usa questi dettagli' : 'Conferma dettagli'}
                                        </Button>
                                    ) : (
                                        <Button
                                            type={"button"}
                                            onClick={(e) => { e.preventDefault(); handleUndo() }}
                                            variant="outline"
                                        >
                                            Annulla modifiche
                                        </Button>
                                    )
                                }
                                {
                                    isEditing.editingDettagli && (
                                        <Button type="submit">
                                            {"Applica modifiche"}
                                        </Button>
                                    )
                                }
                            </>
                        )}
                        {(isDisabled && isEditable) && (
                            <Button type='button' onClick={(e) => { e.preventDefault(); updateActive(2); toggleEditingDettagli() }}>
                                Modifica dettagli
                            </Button>
                        )}
                    </Button.Group>
                </Group>
            </form>
        </>
    )
}
