import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Checkbox, Group, Paper, SegmentedControl, Select, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { CAPACITA_OPTIONS } from '../../utils/dispositiviUtils'
import {
    getGetRepairByIdQueryKey,
    useGetAllBrands,
    useGetAllColors,
    useGetModelsByBrandId,
    useUpdateProduct,
    type ProductResponse,
} from '../../api'
import PatternLock from '../PatternLock'


const schema = z.object({
    capacita: z.string().optional(),
    codiceModello: z.string().optional(),
    seriale: z.string().optional(),
    imei: z.string().optional(),
    pin: z.string().optional(),
    accessori: z.string().optional(),
    codiceUnlock: z.string().optional(),
    sequenzaUnlock: z.array(z.number()).optional(),
    contattoConLiquidi: z.boolean(),
    dispositivoNonTestabile: z.boolean(),
    acquistatoPressoDiNoi: z.boolean(),
    lasciatoInNegozio: z.boolean(),
})

type FormData = z.infer<typeof schema>

interface Props {
    product: ProductResponse
    repairId: string
}

export default function SezioneDispositivo({ product, repairId }: Props) {
    const hasSequenza = (product.sequenzaUnlock?.length ?? 0) > 0
    const [unlockMode, setUnlockMode] = useState<'codice' | 'sequenza'>(hasSequenza ? 'sequenza' : 'codice')

    const [selectedBrandId, setSelectedBrandId] = useState<number>(product.model.brandId)
    const [selectedModelId, setSelectedModelId] = useState<number | null>(product.model.id)
    const [selectedColorId, setSelectedColorId] = useState<number>(product.color.id)

    const { data: brands = [] } = useGetAllBrands()
    const { data: models = [] } = useGetModelsByBrandId(selectedBrandId)
    const { data: colors = [] } = useGetAllColors()

    const selectionChanged =
        selectedBrandId !== product.model.brandId ||
        selectedModelId !== product.model.id ||
        selectedColorId !== product.color.id

    const queryClient = useQueryClient()
    const { mutate: updateProduct, isPending } = useUpdateProduct({
        mutation: {
            onSuccess: () => {
                toast.success('Dispositivo aggiornato')
                queryClient.invalidateQueries({ queryKey: getGetRepairByIdQueryKey(repairId) })
            },
            onError: () => toast.error('Errore durante il salvataggio'),
        }
    })

    const { register, control, handleSubmit, reset, setValue, formState: { errors, isDirty } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            capacita: product.capacita ?? '',
            codiceModello: product.codiceModello ?? '',
            seriale: product.seriale ?? '',
            imei: product.imei ?? '',
            pin: product.pin ?? '',
            accessori: product.accessori ?? '',
            codiceUnlock: product.codiceUnlock ?? '',
            sequenzaUnlock: product.sequenzaUnlock ?? [],
            contattoConLiquidi: product.contattoConLiquidi ?? false,
            dispositivoNonTestabile: product.dispositivoNonTestabile ?? false,
            acquistatoPressoDiNoi: product.acquistatoPressoDiNoi ?? false,
            lasciatoInNegozio: product.lasciatoInNegozio ?? false,
        },
    })

    useEffect(() => {
        reset({
            capacita: product.capacita ?? '',
            codiceModello: product.codiceModello ?? '',
            seriale: product.seriale ?? '',
            imei: product.imei ?? '',
            pin: product.pin ?? '',
            accessori: product.accessori ?? '',
            codiceUnlock: product.codiceUnlock ?? '',
            sequenzaUnlock: product.sequenzaUnlock ?? [],
            contattoConLiquidi: product.contattoConLiquidi ?? false,
            dispositivoNonTestabile: product.dispositivoNonTestabile ?? false,
            acquistatoPressoDiNoi: product.acquistatoPressoDiNoi ?? false,
            lasciatoInNegozio: product.lasciatoInNegozio ?? false,
        })
        setSelectedBrandId(product.model.brandId)
        setSelectedModelId(product.model.id)
        setSelectedColorId(product.color.id)
    }, [product])

    const canSave = (isDirty || selectionChanged) && selectedModelId !== null

    const onSubmit = (data: FormData) => {
        const model = models.find(m => m.id === selectedModelId)
        const color = colors.find(c => c.id === selectedColorId)
        if (!model || !color) return

        updateProduct({
            id: product.id,
            data: {
                model: { nome: model.nome, tipoDispositivo: model.tipoDispositivo, brandNome: model.brandNome },
                color: { nome: color.nome },
                capacita: data.capacita || undefined,
                codiceModello: data.codiceModello || undefined,
                seriale: data.seriale || undefined,
                imei: data.imei || undefined,
                pin: data.pin || undefined,
                accessori: data.accessori || undefined,
                codiceUnlock: unlockMode === 'codice' ? (data.codiceUnlock || undefined) : undefined,
                sequenzaUnlock: unlockMode === 'sequenza' ? (data.sequenzaUnlock || undefined) : undefined,
                contattoConLiquidi: data.contattoConLiquidi,
                dispositivoNonTestabile: data.dispositivoNonTestabile,
                acquistatoPressoDiNoi: data.acquistatoPressoDiNoi,
                lasciatoInNegozio: data.lasciatoInNegozio,
            }
        })
    }

    const handleReset = () => {
        reset()
        setSelectedBrandId(product.model.brandId)
        setSelectedModelId(product.model.id)
        setSelectedColorId(product.color.id)
    }

    return (
        <Paper radius={12} p="md" h="100%">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack gap="sm">
                    <Group justify="space-between" align="center">
                        <Title order={5}>Dispositivo</Title>
                        <Text size="xs" c="dimmed" ff="monospace">ID: {product.id}</Text>
                    </Group>

                    <SimpleGrid cols={{ base: 2, sm: 2 }} spacing="xs">
                        <Checkbox label="Contatto con liquidi" {...register('contattoConLiquidi')} />
                        <Checkbox label="Non testabile" {...register('dispositivoNonTestabile')} />
                        <Checkbox label="Acquistato da noi" {...register('acquistatoPressoDiNoi')} />
                        <Checkbox label="Lasciato in negozio" {...register('lasciatoInNegozio')} />
                    </SimpleGrid>

                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                        <Select
                            label="Brand"
                            searchable
                            data={brands.map(b => ({ value: String(b.id), label: b.nome }))}
                            value={String(selectedBrandId)}
                            onChange={(v) => {
                                if (!v) return
                                setSelectedBrandId(Number(v))
                                setSelectedModelId(null)
                            }}
                        />
                        <Select
                            label="Modello"
                            searchable
                            data={models.map(m => ({ value: String(m.id), label: m.nome }))}
                            value={selectedModelId !== null ? String(selectedModelId) : null}
                            onChange={(v) => { if (v) setSelectedModelId(Number(v)) }}
                        />
                        <Select
                            label="Colore"
                            searchable
                            data={colors.map(c => ({ value: String(c.id), label: c.nome }))}
                            value={String(selectedColorId)}
                            onChange={(v) => { if (v) setSelectedColorId(Number(v)) }}
                        />
                        <Controller
                            name="capacita"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    label="Capacità"
                                    data={CAPACITA_OPTIONS}
                                    value={field.value || null}
                                    onChange={field.onChange}
                                    error={errors.capacita?.message}
                                    clearable
                                />
                            )}
                        />
                        <TextInput label="Codice modello" error={errors.codiceModello?.message} {...register('codiceModello')} />
                        <TextInput label="Seriale" error={errors.seriale?.message} {...register('seriale')} />
                        <TextInput label="IMEI" error={errors.imei?.message} {...register('imei')} />
                        <TextInput label="PIN" error={errors.pin?.message} {...register('pin')} />
                        <TextInput label="Accessori" error={errors.accessori?.message} {...register('accessori')} />
                    </SimpleGrid>

                    <Stack gap={4}>
                        <SegmentedControl
                            value={unlockMode}
                            onChange={(v) => {
                                const mode = v as 'codice' | 'sequenza'
                                setUnlockMode(mode)
                                if (mode === 'codice') setValue('sequenzaUnlock', [], { shouldDirty: true })
                                else setValue('codiceUnlock', '', { shouldDirty: true })
                            }}
                            data={[
                                { label: 'Codice sblocco', value: 'codice' },
                                { label: 'Sequenza sblocco', value: 'sequenza' },
                            ]}
                            w="fit-content"
                        />
                        {unlockMode === 'codice' ? (
                            <SimpleGrid cols={{ base: 1, sm: 2 }}>
                                <TextInput error={errors.codiceUnlock?.message} {...register('codiceUnlock')} />
                            </SimpleGrid>
                        ) : (
                            <Controller
                                name="sequenzaUnlock"
                                control={control}
                                render={({ field }) => (
                                    <PatternLock value={field.value ?? []} onChange={field.onChange} />
                                )}
                            />
                        )}
                    </Stack>

                    <Group justify="flex-end" gap="xs">
                        <Button variant="light" color="red" type="button" disabled={!canSave} onClick={handleReset}>Reset</Button>
                        <Button type="submit" loading={isPending} disabled={!canSave}>Salva</Button>
                    </Group>
                </Stack>
            </form>
        </Paper>
    )
}
