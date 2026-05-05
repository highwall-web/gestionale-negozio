import { Button, Group, Modal, Text } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { getGetAllBrandsPaginatedQueryKey, useDeleteBrand, type BrandResponse } from '../../api'
import { getAxiosErrorMessage } from '../../utils/errorUtils'

interface Props {
    brand: BrandResponse | null
    onClose: () => void
}

export default function ModalEliminaBrand({ brand, onClose }: Props) {
    const queryClient = useQueryClient()
    const { mutate: deleteBrand, isPending } = useDeleteBrand({
        mutation: {
            onSuccess: () => {
                toast.success('Brand eliminato')
                queryClient.invalidateQueries({ queryKey: getGetAllBrandsPaginatedQueryKey() })
                onClose()
            },
            onError: (error: AxiosError) => toast.error(getAxiosErrorMessage(error)),
        }
    })

    return (
        <Modal opened={brand !== null} onClose={onClose} title="Conferma eliminazione" size="sm">
            <Text mb="lg">
                Sei sicuro di voler eliminare <strong>{brand?.nome}</strong>? L'operazione non è reversibile.
            </Text>
            <Group justify="flex-end">
                <Button variant="default" onClick={onClose}>Annulla</Button>
                <Button color="red" loading={isPending} onClick={() => brand && deleteBrand({ id: brand.id })}>Elimina</Button>
            </Group>
        </Modal>
    )
}
