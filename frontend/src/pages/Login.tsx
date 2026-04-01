import { useNavigate, Navigate } from 'react-router-dom'
import { Button, Checkbox, Container, Paper, PasswordInput, TextInput, Title } from '@mantine/core'
import { login } from '../api'
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../routes'

const schema = z.object({
    username: z.string().min(1, 'Username obbligatorio'),
    password: z.string().min(1, 'Password obbligatoria'),
    rememberMe: z.boolean(),
})

type FormData = z.infer<typeof schema>

export default function Login() {
    const navigate = useNavigate()
    const { authLogin, isAuthenticated } = useAuth()

    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: { username: '', password: '', rememberMe: false },
    })

    const onSubmit = async (data: FormData) => {
        try {
            const response = await login(data)
            authLogin(response.accessToken)
            navigate(ROUTES.HOME)
        } catch {
            toast.error('Login fallito. Verifica le credenziali.')
        }
    }

    if (isAuthenticated) {
        return <Navigate to={ROUTES.HOME} replace />
    }

    return (
        <Container size={520} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Title order={1} ta="center">
                Bentornato!👋
            </Title>
            <Title order={6} ta="center" mb="xl" c={'dimmed'}>
                Effettua il login al gestionale
            </Title>

            <Paper withBorder shadow="md" p={30} radius="12">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <TextInput
                        label="Username"
                        placeholder="Inserisci username"
                        withAsterisk
                        error={errors.username?.message}
                        {...register('username')}
                        styles={{ root: { position: 'relative', marginBottom: '1.5rem' }, error: { position: 'absolute' } }}
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="Inserisci password"
                        withAsterisk
                        error={errors.password?.message}
                        {...register('password')}
                        styles={{ root: { position: 'relative', marginBottom: '1.5rem' }, error: { position: 'absolute' } }}
                    />

                    <Controller
                        name="rememberMe"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                label="Ricordami"
                                checked={field.value}
                                onChange={field.onChange}
                                mb="xl"
                            />
                        )}
                    />

                    <Button type="submit" fullWidth loading={isSubmitting}>
                        Accedi
                    </Button>
                </form>
            </Paper>
        </Container>
    )
}
