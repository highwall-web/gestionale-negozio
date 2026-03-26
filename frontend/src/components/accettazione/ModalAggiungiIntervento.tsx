import { zodResolver } from "@hookform/resolvers/zod"
import { Button, Checkbox, Group, Modal, NumberInput, Stack, Switch, Text, TextInput } from "@mantine/core"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import z from "zod"
import { useQueryClient } from "@tanstack/react-query"
import { getGetInterventiGeneraliQueryKey, getGetInterventionsByModelQueryKey, useCreateIntervention, type CreateInterventionRequest, type ModelResponse } from "../../api"
import toast from "react-hot-toast"

const schema = z.object({
    nome: z.string().min(1, "Il nome è obbligatorio"),
    prezzo: z.number({ error: "Il prezzo è obbligatorio" }).min(0, "Il prezzo è obbligatorio"),
    periodoGaranzia: z.number().min(0).optional(),
    cumulabile: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
    opened: boolean
    onClose: () => void
    onSuccess: (data: CreateInterventionRequest) => void
    model: ModelResponse | null
}

export default function ModalAggiungiIntervento({ opened, onClose, onSuccess, model }: Props) {
    const [isGenerale, setIsGenerale] = useState(false)
    const { mutate: createIntervention, isPending } = useCreateIntervention()
    const queryClient = useQueryClient()

    const { register, control, reset, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            nome: "",
            prezzo: undefined,
            periodoGaranzia: undefined,
            cumulabile: false,
        }
    })

    function onSubmit(data: FormData) {
        const payload: CreateInterventionRequest = {
            nome: data.nome,
            prezzo: data.prezzo,
            periodoGaranzia: data.periodoGaranzia,
            cumulabile: data.cumulabile,
            modelId: isGenerale ? undefined : model?.id,
        }
        createIntervention({ data: payload }, {
            onSuccess: (res) => {
                toast.success("Intervento aggiunto")
                queryClient.invalidateQueries({ queryKey: getGetInterventiGeneraliQueryKey() })
                if (model?.id) queryClient.invalidateQueries({ queryKey: getGetInterventionsByModelQueryKey(model.id) })
                onSuccess(res)
                reset()
            },
            onError: () => toast.error("Errore durante l'aggiunta dell'intervento")
        })
    }

    function handleClose() {
        reset()
        onClose()
    }

    return (
        <Modal opened={opened} onClose={handleClose} title="Aggiungi intervento" centered>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack>
                    <Group gap="sm">
                        <Switch
                            checked={isGenerale}
                            onChange={e => setIsGenerale(e.currentTarget.checked)}
                        />
                        <Text size="md">È un intervento generale?</Text>
                    </Group>
                    {!isGenerale && (
                        <TextInput
                            label="Intervento per:"
                            value={model?.nome ?? ""}
                            disabled
                        />
                    )}
                    <TextInput
                        label="Nome"
                        placeholder="Es. Sostituzione schermo"
                        withAsterisk
                        error={errors.nome?.message}
                        styles={{ root: { position: 'relative' }, error: { position: 'absolute' } }}
                        {...register("nome")}
                    />
                    <Controller
                        name="prezzo"
                        control={control}
                        render={({ field }) => (
                            <NumberInput
                                label="Prezzo"
                                min={0}
                                prefix="€ "
                                decimalScale={2}
                                fixedDecimalScale
                                withAsterisk
                                value={field.value ?? 0}
                                onChange={field.onChange}
                                styles={{ root: { position: 'relative' }, error: { position: 'absolute' } }}
                                error={errors.prezzo?.message}
                            />
                        )}
                    />
                    <Controller
                        name="periodoGaranzia"
                        control={control}
                        render={({ field }) => (
                            <NumberInput
                                label="Periodo garanzia (mesi)"
                                min={0}
                                value={field.value ?? ""}
                                onChange={field.onChange}
                                error={errors.periodoGaranzia?.message}
                            />
                        )}
                    />
                    <Controller
                        name="cumulabile"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                label="Cumulabile"
                                checked={field.value ?? false}
                                onChange={e => field.onChange(e.currentTarget.checked)}
                            />
                        )}
                    />
                    <Group justify="space-between" mt="sm">
                        <Button variant="default" type="button" onClick={() => reset()}>
                            Reset
                        </Button>
                        <Button.Group>
                            <Button variant="default" type="button" onClick={handleClose}>
                                Annulla
                            </Button>
                            <Button type="submit" loading={isPending}>
                                Aggiungi
                            </Button>
                        </Button.Group>
                    </Group>
                </Stack>
            </form>
        </Modal>
    )
}
