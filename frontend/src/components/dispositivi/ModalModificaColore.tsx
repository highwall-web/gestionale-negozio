import { Button, Group, Modal, Stack, TextInput } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { getGetAllColorsPaginatedQueryKey, useUpdateColor, type ColorResponse } from '../../api'

interface Props {
    opened: boolean
    onClose: () => void
    colore: ColorResponse
}

export default function ModalModificaColore({ opened, onClose, colore }: Props) {
    const [nome, setNome] = useState(colore.nome)

    const queryClient = useQueryClient()
    const { mutate: updateColore, isPending } = useUpdateColor({
        mutation: {
            onSuccess: () => {
                toast.success('Colore aggiornato')
                queryClient.invalidateQueries({ queryKey: getGetAllColorsPaginatedQueryKey() })
                onClose()
            },
            onError: () => toast.error('Errore durante il salvataggio'),
        }
    })

    const handleSalva = () => {
        if (!nome) return
        updateColore({ id: colore.id, data: { nome } })
    }

    return (
        <Modal opened={opened} onClose={onClose} title="Modifica colore" size="sm">
            <Stack>
                <TextInput
                    label="Nome"
                    value={nome}
                    onChange={e => setNome(e.currentTarget.value)}
                    withAsterisk
                />
                <Group justify="space-between">
                    <Button variant="light" color="red" onClick={() => setNome(colore.nome)}>Reset</Button>
                    <Button.Group>
                        <Button variant="default" onClick={onClose}>Annulla</Button>
                        <Button loading={isPending} disabled={!nome} onClick={handleSalva}>Salva</Button>
                    </Button.Group>
                </Group>
            </Stack>
        </Modal>
    )
}
