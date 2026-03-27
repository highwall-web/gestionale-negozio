import { zodResolver } from '@hookform/resolvers/zod';
import { Autocomplete, Button, Group, SegmentedControl, Select, SimpleGrid, Stack, TextInput, Title, Tooltip } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import toast from "react-hot-toast";
import z from "zod";
import { CreateProductRequestTipoDispositivo, getGetAllBrandsQueryKey, getGetAllColorsQueryKey, getGetModelsByBrandIdQueryKey, useCreateColor, useCreateModel, useGetModelsByBrandId, type CreateProductRequest } from "../../api";
import { useAccettazione } from "../../context/AccettazioneContext";
import { capitalize } from "../../utils/stringUtils";
import PatternLock from "./PatternLock";

const schema = z.object({
    brandNome: z.string().min(1, "Campo obbligatorio"),
    modelNome: z.string().min(1, "Campo obbligatorio"),
    colorNome: z.string().min(1, "Campo obbligatorio"),
    codiceModello: z.string().optional(),
    tipoDispositivo: z.enum(CreateProductRequestTipoDispositivo),
    capacita: z.string().optional(),
    codiceUnlock: z.string().optional(),
    sequenzaUnlock: z.array(z.number()).optional(),
    pin: z.string().optional(),
    accessori: z.string().optional(),
    seriale: z.string().optional(),
    imei: z.string().optional(),
})

type FormData = z.infer<typeof schema>

interface Props {
    onSuccess: (product: CreateProductRequest) => void
}

export default function FormDispositivo({ onSuccess }: Props) {

    const { active, updateActive, isEditing, toggleEditingDispositivo, brands, colors, setSelectedModel } = useAccettazione();
    const { mutateAsync: createModel } = useCreateModel()
    const { mutateAsync: createColor } = useCreateColor()
    const queryClient = useQueryClient()
    const [unlockMode, setUnlockMode] = useState<"codice" | "sequenza">("codice")
    const isDisabled = active !== 1;
    const [selectedProduct, setSelectedProduct] = useState<CreateProductRequest | null>(null);
    const [isModelSelected, setIsModelSelected] = useState(false)
    const [isEditable, setIsEditable] = useState(false);

    const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            brandNome: "",
            modelNome: "",
            colorNome: "",
            codiceModello: "",
            tipoDispositivo: undefined,
            capacita: "",
            codiceUnlock: "",
            sequenzaUnlock: [],
            pin: "",
            accessori: "",
            seriale: "",
            imei: "",
        },
    })

    const [brandNome, modelNome] = useWatch({ control, name: ['brandNome', 'modelNome'] })

    const brandId = brands.find(b => b.nome === brandNome)?.id ?? null
    const { data: modelsData } = useGetModelsByBrandId(brandId!, {
        query: { enabled: !!brandId }
    })
    const models = modelsData?.map(m => m.nome) ?? []

    const justSelectedRef = useRef(false)
    const wasEditingRef = useRef(false)

    function resetToSelected() {
        if (!selectedProduct) return
        reset({
            brandNome: selectedProduct.model.brandNome ?? '',
            modelNome: selectedProduct.model.nome ?? '',
            tipoDispositivo: selectedProduct.model.tipoDispositivo ?? undefined,
            colorNome: selectedProduct.color.nome ?? '',
            codiceModello: selectedProduct.codiceModello ?? '',
            capacita: selectedProduct.capacita ?? '',
            codiceUnlock: selectedProduct.codiceUnlock ?? '',
            sequenzaUnlock: selectedProduct.sequenzaUnlock ?? [],
            pin: selectedProduct.pin ?? '',
            accessori: selectedProduct.accessori ?? '',
            seriale: selectedProduct.seriale ?? '',
            imei: selectedProduct.imei ?? '',
        })
    }

    function handleToggleEditing() {
        if (!isEditing.editingDispositivo) return;
        toggleEditingDispositivo()
    }

    function handleUndo() {
        if (!selectedProduct) return;
        resetToSelected();
        onSuccess(selectedProduct);
        handleToggleEditing();
    }

    function onSubmit(data: FormData) {
        setIsEditable(true);
        createProduct(data);
    }

    async function createProduct(data: FormData) {
        const product: CreateProductRequest = {
            model: {
                brandNome: capitalize(data.brandNome),
                nome: data.modelNome,
                tipoDispositivo: data.tipoDispositivo
            },
            color: {
                nome: capitalize(data.colorNome)
            },
            codiceModello: data.codiceModello,
            capacita: data.capacita,
            codiceUnlock: data.codiceUnlock,
            sequenzaUnlock: data.sequenzaUnlock,
            pin: data.pin,
            accessori: data.accessori,
            seriale: data.seriale,
            imei: data.imei
        }

        try {
            const modelExists = modelsData?.some(m => m.nome.toUpperCase() === data.modelNome.toUpperCase())
            const colorExists = colors.some(c => c.nome.toUpperCase() === data.colorNome.toUpperCase())

            if (!modelExists) {
                const model = await createModel({ data: { brandNome: product.model.brandNome, nome: product.model.nome, tipoDispositivo: product.model.tipoDispositivo } })
                setSelectedModel(model)
                if (brandId) queryClient.invalidateQueries({ queryKey: getGetModelsByBrandIdQueryKey(brandId) })
                queryClient.invalidateQueries({ queryKey: getGetAllBrandsQueryKey() })
            } else {
                const existingModel = modelsData?.find(m => m.nome === data.modelNome)
                if (existingModel) setSelectedModel(existingModel)
            }

            if (!colorExists) {
                await createColor({ data: { nome: product.color.nome } })
                queryClient.invalidateQueries({ queryKey: getGetAllColorsQueryKey() })
            }
            toast.success("Dispositivo inserito")
            setSelectedProduct(product)
            onSuccess(product)
            handleToggleEditing()
        } catch {
            toast.error("Qualcosa è andato storto, riprova")
        }
    }

    function handleReset() {
        reset({
            brandNome: '',
            modelNome: '',
            colorNome: '',
            codiceModello: '',
            tipoDispositivo: undefined,
            capacita: '',
            codiceUnlock: '',
            sequenzaUnlock: [],
            pin: '',
            accessori: '',
            seriale: '',
            imei: '',
        })
        if (!isEditing.editingDispositivo) {
            setSelectedProduct(null)
        }
    }

    useEffect(() => {
        if (wasEditingRef.current && !isEditing.editingDispositivo) {
            resetToSelected()
        }
        wasEditingRef.current = isEditing.editingDispositivo
    }, [isEditing.editingDispositivo]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Title order={4} mb={"md"}>Dispositivo</Title>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Controller
                    name="brandNome"
                    control={control}
                    render={({ field }) => (
                        <Autocomplete
                            label="Brand"
                            data={brands.map(b => b.nome)}
                            withAsterisk
                            onChange={(v) => {
                                field.onChange(v)
                                if (modelNome) {
                                    setValue('modelNome', '')
                                    setIsModelSelected(false)
                                }
                            }}
                            error={errors.brandNome?.message}
                            value={field.value}
                            styles={{ root: { position: 'relative' }, error: { position: 'absolute' } }}
                            disabled={isDisabled}
                        />
                    )}
                />
                <Controller
                    name="modelNome"
                    control={control}
                    render={({ field }) => (
                        <Tooltip label="Inserisci prima il brand" disabled={!!brandNome || isDisabled} position="bottom-start">
                            <div>
                                <Autocomplete
                                    label="Modello"
                                    data={models}
                                    disabled={!brandNome || isDisabled}
                                    withAsterisk
                                    onChange={(v) => {
                                        field.onChange(v)
                                        if (justSelectedRef.current) {
                                            justSelectedRef.current = false
                                        } else {
                                            setIsModelSelected(false)
                                        }
                                    }}
                                    onOptionSubmit={(v) => {
                                        justSelectedRef.current = true
                                        setIsModelSelected(true)
                                        const match = modelsData?.find(m => m.nome === v)
                                        if (match) setValue('tipoDispositivo', match.tipoDispositivo)
                                    }}
                                    error={errors.modelNome?.message}
                                    value={field.value}
                                    styles={{ root: { position: 'relative' }, error: { position: 'absolute' } }}
                                />
                            </div>
                        </Tooltip>
                    )}
                />
                <TextInput
                    label="Codice Modello"
                    error={errors.codiceModello?.message}
                    disabled={isDisabled}
                    {...register('codiceModello')}
                />
                <Controller
                    name="tipoDispositivo"
                    control={control}
                    render={({ field }) => (
                        <Tooltip label="Inserisci prima il brand" disabled={!!brandNome || isDisabled} position="bottom-start">
                            <div>
                                <Select
                                    label="Tipo dispositivo"
                                    withAsterisk
                                    data={Object.values(CreateProductRequestTipoDispositivo).map(v => ({
                                        value: v,
                                        label: capitalize(v)
                                    }))}
                                    error={errors.capacita?.message}
                                    value={field.value || null}
                                    onChange={field.onChange}
                                    clearable
                                    disabled={!brandNome || isDisabled || isModelSelected}
                                />
                            </div>
                        </Tooltip>
                    )}
                />
                <Controller
                    name="colorNome"
                    control={control}
                    render={({ field }) => (
                        <Autocomplete
                            label="Colore"
                            data={colors.map(c => c.nome)}
                            withAsterisk
                            onChange={field.onChange}
                            error={errors.colorNome?.message}
                            value={field.value}
                            styles={{ root: { position: 'relative' }, error: { position: 'absolute' } }}
                            disabled={isDisabled}
                        />
                    )}
                />
                <Controller
                    name="capacita"
                    control={control}
                    render={({ field }) => (
                        <Select
                            label="Capacità"
                            data={Array.from({ length: 9 }, (_, i) => {
                                const gb = 8 * Math.pow(2, i);
                                const label = gb >= 1024 ? `${gb / 1024}TB` : `${gb}GB`;
                                return { value: label, label };
                            })}
                            error={errors.capacita?.message}
                            value={field.value || null}
                            onChange={field.onChange}
                            clearable
                            disabled={isDisabled}
                        />
                    )}
                />
                <TextInput
                    label="PIN"
                    error={errors.pin?.message}
                    disabled={isDisabled}
                    {...register('pin')}
                />
                <TextInput
                    label="Accessori"
                    error={errors.accessori?.message}
                    disabled={isDisabled}
                    {...register('accessori')}
                />
                <TextInput
                    label="Seriale"
                    error={errors.seriale?.message}
                    disabled={isDisabled}
                    {...register('seriale')}
                />
                <TextInput
                    label="IMEI"
                    error={errors.imei?.message}
                    disabled={isDisabled}
                    {...register('imei')}
                />
            </SimpleGrid>
            <Stack gap={4} mt="lg">
                <SegmentedControl
                    value={unlockMode}
                    onChange={(v) => {
                        const mode = v as "codice" | "sequenza"
                        setUnlockMode(mode)
                        if (mode === "codice") setValue("sequenzaUnlock", [])
                        else setValue("codiceUnlock", "")
                    }}
                    data={[
                        { label: "Codice sblocco", value: "codice" },
                        { label: "Sequenza sblocco", value: "sequenza" },
                    ]}
                    w="fit-content"
                    disabled={isDisabled}
                />
                {unlockMode === "codice" ? (
                    <SimpleGrid cols={{ base: 1, sm: 2 }}>
                        <TextInput
                            error={errors.codiceUnlock?.message}
                            disabled={isDisabled}
                            {...register("codiceUnlock")}
                        />
                    </SimpleGrid>
                ) : (
                    <Controller
                        name="sequenzaUnlock"
                        control={control}
                        render={({ field }) => (
                            <PatternLock
                                value={field.value ?? []}
                                onChange={field.onChange}
                                disabled={isDisabled}
                            />
                        )}
                    />
                )}
            </Stack>
            <Group justify='flex-end' mt="xl">
                <Button.Group>
                    {active === 1 && (
                        <>
                            <Button variant="default" type="button" onClick={handleReset}>
                                Reset
                            </Button>
                            {
                                !isEditing.editingDispositivo ? (
                                    <Button
                                        type={"submit"}
                                    >
                                        {selectedProduct ? 'Usa questo dispositivo' : 'Inserisci dispositivo come nuovo'}
                                    </Button>
                                ) : (
                                    <Button
                                        type={"button"}
                                        variant='outline'
                                        onClick={(e) => { e.preventDefault(); handleUndo() }}
                                    >
                                        Annulla modifiche
                                    </Button>
                                )
                            }
                            {
                                isEditing.editingDispositivo && (
                                    <Button type="submit">
                                        {'Applica modifiche'}
                                    </Button>
                                )
                            }
                        </>
                    )}
                    {(isDisabled && isEditable) && (
                        <Button type='button' onClick={(e) => { e.preventDefault(); updateActive(1); toggleEditingDispositivo() }}>
                            Modifica dispositivo
                        </Button>
                    )}
                </Button.Group>
            </Group>
        </form>
    )
}
