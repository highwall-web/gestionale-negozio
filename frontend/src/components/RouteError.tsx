import { Button, Center, Stack, Text, Title } from '@mantine/core'
import { useRouteError } from 'react-router-dom'

export default function RouteError() {
    const error = useRouteError()
    const isDynamicImportError = error instanceof Error && error.message.includes('dynamically imported module')

    return (
        <Center h="100vh">
            <Stack align="center" gap="xs">
                <Title order={3}>Qualcosa è andato storto</Title>
                {isDynamicImportError ? (
                    <>
                        <Text c="dimmed" size="sm">Impossibile caricare la pagina. Verifica la connessione.</Text>
                        <Button onClick={() => window.location.reload()}>Riprova</Button>
                    </>
                ) : (
                    <Text c="dimmed" size="sm">Ricarica la pagina o torna alla home.</Text>
                )}
            </Stack>
        </Center>
    )
}
