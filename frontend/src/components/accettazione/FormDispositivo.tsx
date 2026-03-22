import { Autocomplete, Button, SegmentedControl, Select, SimpleGrid, Stack, TextInput, Title, Tooltip } from "@mantine/core";
import PatternLock from "./PatternLock";
import { searchModelByBrandName, useCreateProduct, useUpdateProduct, type ProductResponse } from "../../api";
import { zodResolver } from '@hookform/resolvers/zod'
import z from "zod";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useDebouncedValue } from "@mantine/hooks";
import { useAccettazione } from "../../context/AccettazioneContext";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const schema = z.object({
    brandNome: z.string().min(1, "Campo obbligatorio"),
    modelNome: z.string().min(1, "Campo obbligatorio"),
    colorNome: z.string().min(1, "Campo obbligatorio"),
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
    onSuccess: (product: ProductResponse) => void
}

export default function FormDispositivo({ onSuccess }: Props) {

    const { active, updateActive, isEditing, toggleEditingDispositivo, brands, colors } = useAccettazione();
    const [models, setModels] = useState<string[]>([])
    const [unlockMode, setUnlockMode] = useState<"codice" | "sequenza">("codice")
    const { mutate, isPending } = useCreateProduct();
    const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
    const isLoading = isPending || isUpdating;
    const isDisabled = active !== 1 || isLoading;
    const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);

    const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            brandNome: "",
            modelNome: "",
            colorNome: "",
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
    const [dModel] = useDebouncedValue(modelNome, 300)

    function handleToggleEditing() {
        if (!isEditing.editingDispositivo) return;
        toggleEditingDispositivo()
    }

    function onSubmit(data: FormData) {
        if (selectedProduct) {
            onSuccess(selectedProduct);
            handleToggleEditing();
            return;
        }
        createProduct(data);
    }

    function createProduct(data: FormData) {
        mutate({
            data: {
                brandNome: data.brandNome,
                modelNome: data.modelNome,
                colorNome: data.colorNome,
                capacita: data.capacita,
                codiceUnlock: data.codiceUnlock,
                sequenzaUnlock: data.sequenzaUnlock,
                pin: data.pin,
                accessori: data.accessori,
                seriale: data.seriale,
                imei: data.imei
            }
        }, {
            onSuccess: (product) => {
                toast.success("Dispositivo inserito")
                setSelectedProduct(product)
                onSuccess(product)
                handleToggleEditing();
            },
            onError: () => toast.error("Errore nell'inserimento del dispositivo")
        })
    }

    function handleReset() {
        reset()
        setSelectedProduct(null)
        handleToggleEditing()
    }

    const handleCreate = handleSubmit(createProduct);

    const handleUpdate = handleSubmit((data) => {
        if (!selectedProduct) return;
        updateProduct({
            id: selectedProduct.id,
            data: {
                brandNome: data.brandNome,
                modelNome: data.modelNome,
                colorNome: data.colorNome,
                capacita: data.capacita,
                codiceUnlock: data.codiceUnlock,
                sequenzaUnlock: data.sequenzaUnlock,
                pin: data.pin,
                accessori: data.accessori,
                seriale: data.seriale,
                imei: data.imei
            }
        }, {
            onSuccess: (product) => {
                toast.success("Dispositivo aggiornato")
                setSelectedProduct(product)
                onSuccess(product)
                handleToggleEditing()
            },
            onError: () => toast.error("Errore nell'aggiornamento del dispositivo")
        })
    })

    useEffect(() => {
        if (brands.some(b => b.nome === brandNome) && !!dModel) {
            searchModelByBrandName({ brandNome: brandNome, nome: dModel })
                .then(res => setModels(res.map(r => r.nome)))
        }
    }, [dModel, brands, brandNome])

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
                            onChange={field.onChange}
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
                                    onChange={field.onChange}
                                    error={errors.modelNome?.message}
                                    value={field.value}
                                    styles={{ root: { position: 'relative' }, error: { position: 'absolute' } }}
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
                            value={field.value ?? ""}
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
            <Button.Group mt="xl">
                {active === 1 && (
                    <>
                        <Button type="submit" loading={isPending} disabled={isUpdating}>
                            {selectedProduct ? isEditing.editingDispositivo ? "Annulla modifica" : 'Usa questo dispositivo' : 'Inserisci dispositivo come nuovo'}
                        </Button>
                        {
                            !!selectedProduct && (
                                <Button type="button" variant="outline" loading={isUpdating} disabled={isPending} onClick={handleUpdate}>
                                    {'Modifica dispositivo inserito'}
                                </Button>
                            )
                        }
                        {
                            !!selectedProduct && (
                                <Button type="button" variant="outline" onClick={handleCreate} loading={isPending} disabled={isUpdating}>
                                    {'Inserisci dispositivo come nuovo'}
                                </Button>
                            )
                        }
                        <Button variant="default" type="button" onClick={handleReset} disabled={isLoading}>
                            Reset
                        </Button>
                    </>
                )}
                {(isDisabled && !!selectedProduct) && (
                    <Button type='button' onClick={(e) => { e.preventDefault(); updateActive(1); toggleEditingDispositivo() }}>
                        Modifica dispositivo
                    </Button>
                )}
            </Button.Group>
        </form>
    )
}
