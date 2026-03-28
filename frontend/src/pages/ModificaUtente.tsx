import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Group, Paper, PasswordInput, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { z } from 'zod'
import { useUpdateCurrentUser } from '../api'
import { useAuth } from '../context/AuthContext'

const schema = z.object({
    nome: z.string().optional(),
    email: z.string().optional(),
    password: z.string().optional(),
    confermaPassword: z.string().optional(),
}).superRefine((d, ctx) => {
    const hasNome = !!d.nome
    const hasEmail = !!d.email
    const hasPassword = !!d.password

    if (!hasNome && !hasEmail && !hasPassword) {
        ctx.addIssue({ path: ['nome'], code: "custom", message: 'Compila almeno un campo' })
        return
    }
    if (hasEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email!)) {
        ctx.addIssue({ path: ['email'], code: "custom", message: 'Email non valida' })
    }
    if (hasPassword && d.password!.length < 6) {
        ctx.addIssue({ path: ['password'], code: "custom", message: 'Minimo 6 caratteri' })
    }
    if (hasPassword && d.password !== d.confermaPassword) {
        ctx.addIssue({ path: ['confermaPassword'], code: "custom", message: 'Le password non coincidono' })
    }
})

type FormData = z.infer<typeof schema>

export default function ModificaUtente() {
    const { user } = useAuth()
    const { register: registerField, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
    })

    const { mutate: updateUser, isPending } = useUpdateCurrentUser({
        mutation: {
            onSuccess: () => {
                toast.success('Utente aggiornato con successo')
                reset()
            },
            onError: () => {
                toast.error("Errore durante la modifica dell'utente")
            },
        },
    })

    const onSubmit = (data: FormData) => {
        updateUser({
            data: {
                nome: data.nome,
                email: data.email,
                password: data.password || undefined,
            },
        })
    }

    return (
        <Paper radius={12} p="md" maw={480}>
            <Title order={3} mb="md">Modifica utente ({user?.username})</Title>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack>
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
                        label="Nuova password"
                        {...registerField('password')}
                        error={errors.password?.message}
                    />
                    <PasswordInput
                        label="Conferma password"
                        {...registerField('confermaPassword')}
                        error={errors.confermaPassword?.message}
                    />
                    <Group mt="xs" justify="space-between">
                        <Button variant="default" onClick={() => reset()}>Reset</Button>
                        <Button type="submit" loading={isPending}>Modifica utente</Button>
                    </Group>
                </Stack>
            </form>
        </Paper>
    )
}
