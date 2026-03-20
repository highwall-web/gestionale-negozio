import { Autocomplete, Button, SimpleGrid, TextInput, Title } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { searchCustomers, useCreateCustomer } from '../../api'
import toast from 'react-hot-toast'
import type { CustomerResponse } from '../../api'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

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
    onSuccess: (customer: CustomerResponse) => void,
    active: number
}

function formatCustomer(res: CustomerResponse, idx: number) {
    return `${idx} - ${res.nome}, ${res.cognome} (${res.email} - ${res.telefono})`
}

export default function FormCliente({ onSuccess, active }: Props) {
    const { mutate, isPending } = useCreateCustomer()
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerResponse | null>(null)
    const justSelected = useRef(false)
    const selectedCustomerRef = useRef<CustomerResponse | null>(null)
    const [searchResults, setSearchResults] = useState<CustomerResponse[]>([])

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


    const effectiveResults = (!selectedCustomer && hasSearchTerm) ? searchResults : []

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

    function clearSelectedCustomer() {
        setSelectedCustomer(null)
    }

    function handleReset() {
        reset()
        setSelectedCustomer(null)
        setSearchResults([])
    }

    function onSubmit(data: FormData) {
        if (selectedCustomer) {
            onSuccess(selectedCustomer)
            return
        }
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
                toast.success('Cliente creato')
                setSelectedCustomer(customer)
                onSuccess(customer)
            },
            onError: () => toast.error('Errore nella creazione del cliente'),
        })
    }

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
                                clearSelectedCustomer()
                                field.onChange(e)
                            }}
                            onOptionSubmit={onOptionSubmit}
                            styles={{ root: { position: 'relative' }, error: { position: 'absolute' } }}
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
                                clearSelectedCustomer()
                                field.onChange(e)
                            }}
                            onOptionSubmit={onOptionSubmit}
                            styles={{ root: { position: 'relative' }, error: { position: 'absolute' } }}
                        />
                    )}
                />
                <TextInput
                    label="Email"
                    withAsterisk
                    error={errors.email?.message}
                    {...register('email', { onChange: clearSelectedCustomer })}
                />
                <TextInput
                    label="Telefono"
                    withAsterisk
                    error={errors.telefono?.message}
                    {...register('telefono', { onChange: clearSelectedCustomer })}
                />
                <TextInput
                    label="Telefono secondario"
                    error={errors.telefonoSecondario?.message}
                    {...register('telefonoSecondario', { onChange: clearSelectedCustomer })}
                />
                <TextInput
                    label="Indirizzo"
                    error={errors.indirizzo?.message}
                    {...register('indirizzo', { onChange: clearSelectedCustomer })}
                />
                <TextInput
                    label="Città"
                    error={errors.citta?.message}
                    {...register('citta', { onChange: clearSelectedCustomer })}
                />
                <TextInput
                    label="CAP"
                    error={errors.cap?.message}
                    {...register('cap', { onChange: clearSelectedCustomer })}
                />
            </SimpleGrid>
            <Button.Group mt="xl">
                {active === 0 && (
                    <>
                        <Button type="submit" loading={isPending}>
                            {selectedCustomer ? 'Usa cliente esistente' : 'Crea cliente'}
                        </Button>
                        <Button variant="default" type="button" onClick={handleReset} disabled={isPending}>
                            Reset
                        </Button>
                    </>
                )}
            </Button.Group>
        </form>
    )
}
