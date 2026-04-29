import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Checkbox, Group, Paper, SegmentedControl, Select, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { type ProductResponse } from '../../api'
import PatternLock from '../PatternLock'

const CAPACITA_OPTIONS = Array.from({ length: 9 }, (_, i) => {
    const gb = 8 * Math.pow(2, i)
    const label = gb >= 1024 ? `${gb / 1024}TB` : `${gb}GB`
    return { value: label, label }
})

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
}

export default function SezioneDispositivo({ product }: Props) {
    const hasSequenza = (product.sequenzaUnlock?.length ?? 0) > 0
    const [unlockMode, setUnlockMode] = useState<'codice' | 'sequenza'>(hasSequenza ? 'sequenza' : 'codice')

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

    const onSubmit = () => { /* TODO: collegare backend */ }

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

                    <SimpleGrid cols={{ base: 1, sm: 1 }} spacing="xs">
                        <TextInput label="Brand" value={product.model.brandNome} readOnly />
                        <TextInput label="Modello" value={product.model.nome} readOnly />
                        <TextInput label="Colore" value={product.color.nome} readOnly />
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
                        <Button variant="light" color="red" type="button" disabled={!isDirty} onClick={() => reset()}>Reset</Button>
                        <Button type="submit" disabled={!isDirty}>Salva</Button>
                    </Group>
                </Stack>
            </form>
        </Paper>
    )
}
