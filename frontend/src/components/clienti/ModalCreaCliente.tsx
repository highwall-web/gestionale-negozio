import { Button, Group, Modal, SimpleGrid, Stack, TextInput } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { getGetAllCustomersQueryKey, useCreateCustomer } from '../../api'
import { getAxiosErrorMessage } from '../../utils/errorUtils'

interface Props {
    opened: boolean
    onClose: () => void
}

export default function ModalCreaCliente({ opened, onClose }: Props) {
    const [nome, setNome] = useState('')
    const [cognome, setCognome] = useState('')
    const [email, setEmail] = useState('')
    const [telefono, setTelefono] = useState('')
    const [telefonoSecondario, setTelefonoSecondario] = useState('')
    const [indirizzo, setIndirizzo] = useState('')
    const [citta, setCitta] = useState('')
    const [cap, setCap] = useState('')

    const queryClient = useQueryClient()
    const { mutate: createCliente, isPending } = useCreateCustomer({
        mutation: {
            onSuccess: () => {
                toast.success('Cliente creato')
                queryClient.invalidateQueries({ queryKey: getGetAllCustomersQueryKey() })
                handleClose()
            },
            onError: (e) => toast.error(getAxiosErrorMessage(e)),
        }
    })

    function handleClose() {
        setNome('')
        setCognome('')
        setEmail('')
        setTelefono('')
        setTelefonoSecondario('')
        setIndirizzo('')
        setCitta('')
        setCap('')
        onClose()
    }

    const handleSalva = () => {
        if (!nome || !cognome || !email || !telefono) return
        createCliente({
            data: {
                nome,
                cognome,
                email,
                telefono,
                telefonoSecondario: telefonoSecondario || undefined,
                indirizzo: indirizzo || undefined,
                citta: citta || undefined,
                cap: cap || undefined,
            }
        })
    }

    return (
        <Modal opened={opened} onClose={handleClose} title="Nuovo cliente" size="lg">
            <Stack>
                <SimpleGrid cols={2} spacing="xs">
                    <TextInput label="Nome" value={nome} onChange={e => setNome(e.currentTarget.value)} withAsterisk data-autofocus />
                    <TextInput label="Cognome" value={cognome} onChange={e => setCognome(e.currentTarget.value)} withAsterisk />
                </SimpleGrid>
                <SimpleGrid cols={2} spacing="xs">
                    <TextInput label="Email" value={email} onChange={e => setEmail(e.currentTarget.value)} withAsterisk />
                    <TextInput label="Telefono" value={telefono} onChange={e => setTelefono(e.currentTarget.value)} withAsterisk />
                </SimpleGrid>
                <SimpleGrid cols={2} spacing="xs">
                    <TextInput label="Tel. secondario" value={telefonoSecondario} onChange={e => setTelefonoSecondario(e.currentTarget.value)} />
                    <TextInput label="Indirizzo" value={indirizzo} onChange={e => setIndirizzo(e.currentTarget.value)} />
                </SimpleGrid>
                <SimpleGrid cols={2} spacing="xs">
                    <TextInput label="Città" value={citta} onChange={e => setCitta(e.currentTarget.value)} />
                    <TextInput label="CAP" value={cap} onChange={e => setCap(e.currentTarget.value)} />
                </SimpleGrid>
                <Group justify="flex-end">
                    <Button.Group>
                        <Button variant="default" onClick={handleClose}>Annulla</Button>
                        <Button loading={isPending} disabled={!nome || !cognome || !email || !telefono} onClick={handleSalva}>Crea</Button>
                    </Button.Group>
                </Group>
            </Stack>
        </Modal>
    )
}
