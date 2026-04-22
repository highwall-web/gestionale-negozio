import { Button, Group, Modal, SimpleGrid, Stack, TextInput } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { getGetAllCustomersQueryKey, useUpdateCustomer, type CustomerResponse } from '../../api'
import { getAxiosErrorMessage } from '../../utils/errorUtils'

interface Props {
    opened: boolean
    onClose: () => void
    cliente: CustomerResponse
}

export default function ModalModificaCliente({ opened, onClose, cliente }: Props) {
    const [nome, setNome] = useState(cliente.nome)
    const [cognome, setCognome] = useState(cliente.cognome)
    const [email, setEmail] = useState(cliente.email)
    const [telefono, setTelefono] = useState(cliente.telefono)
    const [telefonoSecondario, setTelefonoSecondario] = useState(cliente.telefonoSecondario ?? '')
    const [indirizzo, setIndirizzo] = useState(cliente.indirizzo ?? '')
    const [citta, setCitta] = useState(cliente.citta ?? '')
    const [cap, setCap] = useState(cliente.cap ?? '')

    const queryClient = useQueryClient()
    const { mutate: updateCliente, isPending } = useUpdateCustomer({
        mutation: {
            onSuccess: () => {
                toast.success('Cliente aggiornato')
                queryClient.invalidateQueries({ queryKey: getGetAllCustomersQueryKey() })
                onClose()
            },
            onError: (e) => toast.error(getAxiosErrorMessage(e)),
        }
    })

    const handleReset = () => {
        setNome(cliente.nome)
        setCognome(cliente.cognome)
        setEmail(cliente.email)
        setTelefono(cliente.telefono)
        setTelefonoSecondario(cliente.telefonoSecondario ?? '')
        setIndirizzo(cliente.indirizzo ?? '')
        setCitta(cliente.citta ?? '')
        setCap(cliente.cap ?? '')
    }

    const handleSalva = () => {
        if (!nome || !cognome || !email || !telefono) return
        updateCliente({
            id: cliente.id,
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
        <Modal opened={opened} onClose={onClose} title="Modifica cliente" size="lg">
            <Stack>
                <SimpleGrid cols={2} spacing="xs">
                    <TextInput label="Nome" value={nome} onChange={e => setNome(e.currentTarget.value)} withAsterisk />
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
                <Group justify="space-between">
                    <Button variant="light" color="red" onClick={handleReset}>Reset</Button>
                    <Button.Group>
                        <Button variant="default" onClick={onClose}>Annulla</Button>
                        <Button loading={isPending} disabled={!nome || !cognome || !email || !telefono} onClick={handleSalva}>Salva</Button>
                    </Button.Group>
                </Group>
            </Stack>
        </Modal>
    )
}
