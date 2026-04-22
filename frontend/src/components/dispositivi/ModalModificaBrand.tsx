import { Button, Group, Modal, Stack, TextInput } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { getGetAllBrandsPaginatedQueryKey, useUpdateBrand, type BrandResponse } from '../../api'

interface Props {
    opened: boolean
    onClose: () => void
    brand: BrandResponse
}

export default function ModalModificaBrand({ opened, onClose, brand }: Props) {
    const [nome, setNome] = useState(brand.nome)

    const queryClient = useQueryClient()
    const { mutate: updateBrand, isPending } = useUpdateBrand({
        mutation: {
            onSuccess: () => {
                toast.success('Brand aggiornato')
                queryClient.invalidateQueries({ queryKey: getGetAllBrandsPaginatedQueryKey() })
                onClose()
            },
            onError: () => toast.error('Errore durante il salvataggio'),
        }
    })

    const handleSalva = () => {
        if (!nome) return
        updateBrand({ id: brand.id, data: { nome } })
    }

    return (
        <Modal opened={opened} onClose={onClose} title="Modifica brand" size="sm">
            <Stack>
                <TextInput
                    label="Nome"
                    value={nome}
                    onChange={e => setNome(e.currentTarget.value)}
                    withAsterisk
                />
                <Group justify="space-between">
                    <Button variant="light" color="red" onClick={() => setNome(brand.nome)}>Reset</Button>
                    <Button.Group>
                        <Button variant="default" onClick={onClose}>Annulla</Button>
                        <Button loading={isPending} disabled={!nome} onClick={handleSalva}>Salva</Button>
                    </Button.Group>
                </Group>
            </Stack>
        </Modal>
    )
}
