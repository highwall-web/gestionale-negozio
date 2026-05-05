import { Button, Group, Modal, Stack, TextInput } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { getGetAllBrandsPaginatedQueryKey, useCreateBrand } from '../../api'

interface Props {
    opened: boolean
    onClose: () => void
}

export default function ModalCreaBrand({ opened, onClose }: Props) {
    const [nome, setNome] = useState('')

    const queryClient = useQueryClient()
    const { mutate: createBrand, isPending } = useCreateBrand({
        mutation: {
            onSuccess: () => {
                toast.success('Brand creato')
                queryClient.invalidateQueries({ queryKey: getGetAllBrandsPaginatedQueryKey() })
                setNome('')
                onClose()
            },
            onError: () => toast.error('Errore durante il salvataggio'),
        }
    })

    const handleSalva = () => {
        if (!nome) return
        createBrand({ data: { nome } })
    }

    return (
        <Modal opened={opened} onClose={onClose} title="Nuovo brand" size="sm">
            <Stack>
                <TextInput
                    label="Nome"
                    value={nome}
                    onChange={e => setNome(e.currentTarget.value)}
                    withAsterisk
                    data-autofocus
                />
                <Group justify="flex-end">
                    <Button.Group>
                        <Button variant="default" onClick={onClose}>Annulla</Button>
                        <Button loading={isPending} disabled={!nome} onClick={handleSalva}>Crea</Button>
                    </Button.Group>
                </Group>
            </Stack>
        </Modal>
    )
}
