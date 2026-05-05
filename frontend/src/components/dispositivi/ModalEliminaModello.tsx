import { Button, Group, Modal, Text } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { getGetAllModelsPaginatedQueryKey, useDeleteModel, type ModelResponse } from '../../api'
import { getAxiosErrorMessage } from '../../utils/errorUtils'

interface Props {
    modello: ModelResponse | null
    onClose: () => void
}

export default function ModalEliminaModello({ modello, onClose }: Props) {
    const queryClient = useQueryClient()
    const { mutate: deleteModello, isPending } = useDeleteModel({
        mutation: {
            onSuccess: () => {
                toast.success('Modello eliminato')
                queryClient.invalidateQueries({ queryKey: getGetAllModelsPaginatedQueryKey() })
                onClose()
            },
            onError: (error: AxiosError) => toast.error(getAxiosErrorMessage(error)),
        }
    })

    return (
        <Modal opened={modello !== null} onClose={onClose} title="Conferma eliminazione" size="sm">
            <Text mb="lg">
                Sei sicuro di voler eliminare <strong>{modello?.nome}</strong>? L'operazione non è reversibile.
            </Text>
            <Group justify="flex-end">
                <Button variant="default" onClick={onClose}>Annulla</Button>
                <Button color="red" loading={isPending} onClick={() => modello && deleteModello({ id: modello.id })}>Elimina</Button>
            </Group>
        </Modal>
    )
}
