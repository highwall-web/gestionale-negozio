import { zodResolver } from '@hookform/resolvers/zod'
import { Autocomplete, Button, Group, SimpleGrid, TextInput, Title } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useResetOnEditEnd } from '../../hooks/useResetOnEditEnd'
import { Controller, useForm, useWatch } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import type { CreateCustomerRequest, CustomerResponse } from '../../api'
import { searchCustomers } from '../../api'
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
    onSuccess: (customer: CreateCustomerRequest, id: number | null) => void
}

function formatCustomer(res: CustomerResponse, idx: number) {
    return `${idx} - ${res.nome}, ${res.cognome} (${res.email} - ${res.telefono})`
}

export default function FormCliente({ onSuccess }: Props) {
    const { active, updateActive, isEditing, toggleEditingCliente, selectedCliente, selectedClienteId } = useAccettazione();
    const [selectedCustomer, setSelectedCustomer] = useState<CreateCustomerRequest | null>(null)
    const justSelected = useRef(false)
    const [searchResults, setSearchResults] = useState<CustomerResponse[]>([])
    const [customerId, setCustomerId] = useState<number | null>(null)
    const [isEditable, setIsEditable] = useState(false);
    const isDisabled = active !== 0;


    const { register, control, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
            nome: '', cognome: '', email: '', telefono: '',
            telefonoSecondario: '', indirizzo: '', citta: '', cap: '',
        },
    })

    const [nome, cognome, telefono, email] = useWatch({ control, name: ['nome', 'cognome', 'telefono', 'email'] })
    const [dNome] = useDebouncedValue(nome, 300)
    const [dCognome] = useDebouncedValue(cognome, 300)
    const telefonoRef = useRef(telefono)
    const emailRef = useRef(email)
    useLayoutEffect(() => { telefonoRef.current = telefono }, [telefono])
    useLayoutEffect(() => { emailRef.current = email }, [email])

    const hasSearchTerm = !!(nome || cognome)

    const effectiveResults = (hasSearchTerm) ? searchResults : []

    function resetToSelected() {
        if (!selectedCliente) return
        setSelectedCustomer(selectedCliente);
        setCustomerId(selectedClienteId);
        reset({
            nome: selectedCliente.nome ?? "",
            cognome: selectedCliente.cognome ?? "",
            email: selectedCliente.email ?? "",
            telefono: selectedCliente.telefono ?? "",
            telefonoSecondario: selectedCliente.telefonoSecondario ?? "",
            indirizzo: selectedCliente.indirizzo ?? "",
            citta: selectedCliente.citta ?? "",
            cap: selectedCliente.cap ?? ""
        })
    }

    function onOptionSubmit(value: string) {
        const customer = searchResults.find((r, idx) => formatCustomer(r, idx) === value)
        if (!customer) return
        justSelected.current = true
        setSelectedCustomer(customer)
        setCustomerId(customer.id)
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
        setSelectedCustomer(null)
        setCustomerId(null)
        setSearchResults([])
    }

    function onSubmit(data: FormData) {
        setIsEditable(true);
        createCustomer(data);
    }

    function handleToggleEditing() {
        if (!isEditing.editingCliente) return;
        toggleEditingCliente()
    }

    function handleUndo() {
        if (!selectedCliente) return;
        resetToSelected();
        onSuccess(selectedCliente, selectedClienteId);
        handleToggleEditing();
    }

    function createCustomer(data: FormData) {
        const customer: CreateCustomerRequest = {
            nome: data.nome,
            cognome: data.cognome,
            email: data.email,
            telefono: data.telefono,
            telefonoSecondario: data.telefonoSecondario || undefined,
            indirizzo: data.indirizzo || undefined,
            citta: data.citta || undefined,
            cap: data.cap || undefined,
        }
        toast.success('Cliente inserito')
        setSelectedCustomer(customer)
        onSuccess(customer, customerId)
        handleToggleEditing()
    }

    useEffect(() => {
        if (!dNome && !dCognome) return
        searchCustomers({
            nome: dNome || undefined,
            cognome: dCognome || undefined,
            telefono: telefonoRef.current || undefined,
            email: emailRef.current || undefined,
        }).then(res => setSearchResults(res))
    }, [dNome, dCognome])

    useResetOnEditEnd(isEditing.editingCliente, resetToSelected)

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
                            disabled={isDisabled || !!customerId}
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
                            disabled={isDisabled || !!customerId}
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
            <Group justify="flex-end" mt="xl">
                <Button.Group>
                    {active === 0 && (
                        <>
                            <Button variant="default" type="button" onClick={handleReset}>
                                Reset
                            </Button>
                            {
                                !isEditing.editingCliente ? (
                                    <Button
                                        type={"submit"}
                                    >
                                        {selectedCustomer ? 'Usa questo cliente' : 'Inserisci cliente come nuovo'}
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
                                isEditing.editingCliente && (
                                    <Button
                                        type="submit"
                                    >
                                        {'Applica modifiche'}
                                    </Button>
                                )
                            }
                        </>
                    )}
                    {(isDisabled && isEditable) && (
                        <Button type='button' onClick={(e) => { e.preventDefault(); updateActive(0); toggleEditingCliente() }}>
                            Modifica cliente
                        </Button>
                    )}
                </Button.Group>
            </Group>
        </form>
    )
}
