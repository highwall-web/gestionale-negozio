import { Button, Group, Modal, Text } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { getGetAllColorsPaginatedQueryKey, useDeleteColor, type ColorResponse } from '../../api'
import { getAxiosErrorMessage } from '../../utils/errorUtils'

interface Props {
    colore: ColorResponse | null
    onClose: () => void
}

export default function ModalEliminaColore({ colore, onClose }: Props) {
    const queryClient = useQueryClient()
    const { mutate: deleteColore, isPending } = useDeleteColor({
        mutation: {
            onSuccess: () => {
                toast.success('Colore eliminato')
                queryClient.invalidateQueries({ queryKey: getGetAllColorsPaginatedQueryKey() })
                onClose()
            },
            onError: (error: AxiosError) => toast.error(getAxiosErrorMessage(error)),
        }
    })

    return (
        <Modal opened={colore !== null} onClose={onClose} title="Conferma eliminazione" size="sm">
            <Text mb="lg">
                Sei sicuro di voler eliminare <strong>{colore?.nome}</strong>? L'operazione non è reversibile.
            </Text>
            <Group justify="flex-end">
                <Button variant="default" onClick={onClose}>Annulla</Button>
                <Button color="red" loading={isPending} onClick={() => colore && deleteColore({ id: colore.id })}>Elimina</Button>
            </Group>
        </Modal>
    )
}
