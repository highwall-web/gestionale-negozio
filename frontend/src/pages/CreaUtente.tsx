import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group, Paper, PasswordInput, Select, Stack, TextInput, Title } from '@mantine/core'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { useRegister } from '../api/endpoints/auth-controller/auth-controller'
import { RegisterRequestRole } from '../api/models/registerRequestRole'

const schema = z.object({
    username: z.string().min(1, 'Campo obbligatorio'),
    nome: z.string().min(1, 'Campo obbligatorio'),
    email: z.email({ error: 'Email non valida' }),
    password: z.string().min(6, 'Minimo 6 caratteri'),
    confermaPassword: z.string().min(1, 'Campo obbligatorio'),
    ruolo: z.enum([RegisterRequestRole.ADMIN, RegisterRequestRole.COMMESSO], { error: 'Campo obbligatorio' }),
}).refine((d) => d.password === d.confermaPassword, {
    message: 'Le password non coincidono',
    path: ['confermaPassword'],
})

type FormData = z.infer<typeof schema>

export default function CreaUtente() {
    const { register: registerField, handleSubmit, reset, control, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { ruolo: RegisterRequestRole.COMMESSO },
    })

    const { mutate: registerUser, isPending } = useRegister({
        mutation: {
            onSuccess: () => {
                toast.success('Utente creato con successo')
                reset()
            },
            onError: () => {
                toast.error("Errore durante la creazione dell'utente")
            },
        },
    })

    const onSubmit = (data: FormData) => {
        registerUser({
            data: {
                username: data.username,
                nome: data.nome,
                email: data.email,
                password: data.password,
                role: data.ruolo,
            },
        })
    }

    return (
        <Paper radius={12} p="md" maw={480}>
            <Title order={3} mb="md">Crea utente</Title>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack>
                    <TextInput
                        label="Username"
                        {...registerField('username')}
                        error={errors.username?.message}
                    />
                    <TextInput
                        label="Nome"
                        {...registerField('nome')}
                        error={errors.nome?.message}
                    />
                    <TextInput
                        label="Email"
                        type="email"
                        {...registerField('email')}
                        error={errors.email?.message}
                    />
                    <PasswordInput
                        label="Password"
                        {...registerField('password')}
                        error={errors.password?.message}
                    />
                    <PasswordInput
                        label="Conferma password"
                        {...registerField('confermaPassword')}
                        error={errors.confermaPassword?.message}
                    />
                    <Controller
                        name="ruolo"
                        control={control}
                        render={({ field }) => (
                            <Select
                                label="Ruolo"
                                data={[
                                    { value: RegisterRequestRole.COMMESSO, label: 'Commesso' },
                                    { value: RegisterRequestRole.ADMIN, label: 'Admin' },
                                ]}
                                value={field.value ?? null}
                                onChange={field.onChange}
                                error={errors.ruolo?.message}
                            />
                        )}
                    />
                    <Group mt="xs" justify="space-between">
                        <Button variant="default" onClick={() => reset()}>Reset</Button>
                        <Button type="submit" loading={isPending}>Crea utente</Button>
                    </Group>
                </Stack>
            </form>
        </Paper>
    )
}
