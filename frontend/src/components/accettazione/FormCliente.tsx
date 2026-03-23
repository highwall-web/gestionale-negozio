import { Autocomplete, Button, SimpleGrid, TextInput, Title } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { searchCustomers, useCreateCustomer, useUpdateCustomer } from '../../api'
import toast from 'react-hot-toast'
import type { CustomerResponse } from '../../api'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useAccettazione } from '../../context/AccettazioneContext'

const schema = z.object({
    nome: z.string().min(1, 'Campo obbligatorio'),
    cognome: z.string().min(1, 'Campo obbligatorio'),
    email: z.email({ error: "Email non valida" }).min(1, 'Campo obbligatorio'),
    telefono: z.string().min(1, 'Campo obbligatorio'),
    telefonoSecondario: z.string().optional(),
    indirizzo: z.string().optional(),
    citta: z.string().optional(),
    cap: z.string().regex(/^\d{5}$/, 'CAP non valido').optional().or(z.literal('')),
})

type FormData = z.infer<typeof schema>

interface Props {
    onSuccess: (customer: CustomerResponse) => void
}

function formatCustomer(res: CustomerResponse, idx: number) {
    return `${idx} - ${res.nome}, ${res.cognome} (${res.email} - ${res.telefono})`
}

export default function FormCliente({ onSuccess }: Props) {
    const { active, updateActive, isEditing, toggleEditingCliente } = useAccettazione();
    const { mutate, isPending } = useCreateCustomer()
    const { mutate: updateCustomer, isPending: isUpdating } = useUpdateCustomer();
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerResponse | null>(null)
    const justSelected = useRef(false)
    const selectedCustomerRef = useRef<CustomerResponse | null>(null)
    const [searchResults, setSearchResults] = useState<CustomerResponse[]>([])
    const isLoading = isPending || isUpdating;
    const isDisabled = active !== 0 || isLoading;
    const wasEditingRef = useRef(false)

    const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            nome: '', cognome: '', email: '', telefono: '',
            telefonoSecondario: '', indirizzo: '', citta: '', cap: '',
        },
    })

    const [nome, cognome] = useWatch({ control, name: ['nome', 'cognome'] })
    const [dNome] = useDebouncedValue(nome, 300)
    const [dCognome] = useDebouncedValue(cognome, 300)

    const hasSearchTerm = !!(nome || cognome)

    const effectiveResults = (!selectedCustomer && hasSearchTerm) ? searchResults : []

    function resetToSelected() {
        if (!selectedCustomer) return
        reset({
            nome: selectedCustomer.nome ?? "",
            cognome: selectedCustomer.cognome ?? "",
            email: selectedCustomer.email ?? "",
            telefono: selectedCustomer.telefono ?? "",
            telefonoSecondario: selectedCustomer.telefonoSecondario ?? "",
            indirizzo: selectedCustomer.indirizzo ?? "",
            citta: selectedCustomer.citta ?? "",
            cap: selectedCustomer.cap ?? ""
        })
    }

    function onOptionSubmit(value: string) {
        const customer = searchResults.find((r, idx) => formatCustomer(r, idx) === value)
        if (!customer) return
        justSelected.current = true
        setSelectedCustomer(customer)
        setValue('nome', customer.nome ?? '')
        setValue('cognome', customer.cognome ?? '')
        setValue('email', customer.email ?? '')
        setValue('telefono', customer.telefono ?? '')
        setValue('telefonoSecondario', customer.telefonoSecondario ?? '')
        setValue('indirizzo', customer.indirizzo ?? '')
        setValue('citta', customer.citta ?? '')
        setValue('cap', customer.cap ?? '')
    }

    function handleReset() {
        reset({
            nome: "",
            cognome: "",
            email: "",
            telefono: "",
            telefonoSecondario: "",
            indirizzo: "",
            citta: "",
            cap: ""
        })
        if (!isEditing.editingCliente) {
            setSelectedCustomer(null)
        }
        setSearchResults([])
    }


    function onSubmit(data: FormData) {
        if (selectedCustomer) {
            onSuccess(selectedCustomer)
            handleToggleEditing()
            return
        }
        createCustomer(data);
    }

    function handleToggleEditing() {
        if (!isEditing.editingCliente) return;
        toggleEditingCliente()
    }

    function handleUndo() {
        if (!selectedCustomer) return;
        resetToSelected();
        onSuccess(selectedCustomer);
        handleToggleEditing();
    }

    function createCustomer(data: FormData) {
        mutate({
            data: {
                nome: data.nome,
                cognome: data.cognome,
                email: data.email,
                telefono: data.telefono,
                telefonoSecondario: data.telefonoSecondario || undefined,
                indirizzo: data.indirizzo || undefined,
                citta: data.citta || undefined,
                cap: data.cap || undefined,
            }
        }, {
            onSuccess: (customer) => {
                toast.success('Cliente inserito')
                setSelectedCustomer(customer)
                onSuccess(customer)
                handleToggleEditing()
            },
            onError: () => toast.error("Errore nell'inserimento del cliente"),
        })
    }

    const handleCreate = handleSubmit(createCustomer)

    const handleUpdate = handleSubmit((data) => {
        if (!selectedCustomer) return;
        updateCustomer({
            id: selectedCustomer.id,
            data: {
                nome: data.nome,
                cognome: data.cognome,
                email: data.email,
                telefono: data.telefono,
                telefonoSecondario: data.telefonoSecondario || undefined,
                indirizzo: data.indirizzo || undefined,
                citta: data.citta || undefined,
                cap: data.cap || undefined,
            }
        }, {
            onSuccess: (customer) => {
                toast.success("Cliente aggiornato")
                setSelectedCustomer(customer)
                onSuccess(customer)
                handleToggleEditing()
            },
            onError: () => toast.error("Errore nell'aggiornamento del cliente")
        })
    })

    useLayoutEffect(() => {
        selectedCustomerRef.current = selectedCustomer
    }, [selectedCustomer])

    useEffect(() => {
        if (!dNome && !dCognome) return
        if (selectedCustomerRef.current) return
        searchCustomers({
            nome: dNome || undefined,
            cognome: dCognome || undefined,
        }).then(res => setSearchResults(res))
    }, [dNome, dCognome])

    useEffect(() => {
        if (wasEditingRef.current && !isEditing.editingCliente) {
            resetToSelected()
        }
        wasEditingRef.current = isEditing.editingCliente
    }, [isEditing.editingCliente]) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Title order={4} mb="md">Cliente</Title>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <Controller
                    name="nome"
                    control={control}
                    render={({ field }) => (
                        <Autocomplete
                            label="Nome"
                            data={effectiveResults.map((eR, idx) => formatCustomer(eR, idx))}
                            withAsterisk
                            error={errors.nome?.message}
                            value={field.value}
                            onChange={(e) => {
                                if (justSelected.current) { justSelected.current = false; return }
                                field.onChange(e)
                            }}
                            onOptionSubmit={onOptionSubmit}
                            styles={{ root: { position: 'relative' }, error: { position: 'absolute' } }}
                            disabled={isDisabled}
                        />
                    )}
                />
                <Controller
                    name="cognome"
                    control={control}
                    render={({ field }) => (
                        <Autocomplete
                            label="Cognome"
                            data={effectiveResults.map((eR, idx) => formatCustomer(eR, idx))}
                            withAsterisk
                            error={errors.cognome?.message}
                            value={field.value}
                            onChange={(e) => {
                                if (justSelected.current) { justSelected.current = false; return }
                                field.onChange(e)
                            }}
                            onOptionSubmit={onOptionSubmit}
                            styles={{ root: { position: 'relative' }, error: { position: 'absolute' } }}
                            disabled={isDisabled}
                        />
                    )}
                />
                <TextInput
                    label="Email"
                    withAsterisk
                    error={errors.email?.message}
                    disabled={isDisabled}
                    {...register('email')}
                />
                <TextInput
                    label="Telefono"
                    withAsterisk
                    error={errors.telefono?.message}
                    disabled={isDisabled}
                    {...register('telefono')}
                />
                <TextInput
                    label="Telefono secondario"
                    error={errors.telefonoSecondario?.message}
                    disabled={isDisabled}
                    {...register('telefonoSecondario')}
                />
                <TextInput
                    label="Indirizzo"
                    error={errors.indirizzo?.message}
                    disabled={isDisabled}
                    {...register('indirizzo')}
                />
                <TextInput
                    label="Città"
                    error={errors.citta?.message}
                    disabled={isDisabled}
                    {...register('citta')}
                />
                <TextInput
                    label="CAP"
                    error={errors.cap?.message}
                    disabled={isDisabled}
                    {...register('cap')}
                />
            </SimpleGrid>
            <Button.Group mt="xl">
                {active === 0 && (
                    <>
                        {
                            !isEditing.editingCliente ? (
                                <Button
                                    type={"submit"}
                                    loading={isPending}
                                    disabled={isUpdating}
                                >
                                    {selectedCustomer ? 'Usa questo cliente' : 'Inserisci cliente come nuovo'}
                                </Button>
                            ) : (
                                <Button
                                    type={"button"}
                                    loading={isPending}
                                    disabled={isUpdating}
                                    onClick={(e) => { e.preventDefault(); handleUndo() }}
                                >
                                    Annulla modifiche
                                </Button>
                            )
                        }

                        {
                            !!selectedCustomer && (
                                <Button type="button" variant="outline" onClick={handleUpdate} loading={isUpdating} disabled={isPending}>
                                    {'Modifica questo cliente'}
                                </Button>
                            )
                        }
                        {
                            !!selectedCustomer && (
                                <Button type="button" variant="outline" onClick={handleCreate} loading={isPending} disabled={isUpdating}>
                                    {'Inserisci cliente come nuovo'}
                                </Button>
                            )
                        }
                        <Button variant="default" type="button" onClick={handleReset} disabled={isLoading}>
                            Reset
                        </Button>
                    </>
                )}
                {(isDisabled && !!selectedCustomer) && (
                    <Button type='button' onClick={(e) => { e.preventDefault(); updateActive(0); toggleEditingCliente() }}>
                        Modifica cliente
                    </Button>
                )}
            </Button.Group>
        </form>
    )
}
