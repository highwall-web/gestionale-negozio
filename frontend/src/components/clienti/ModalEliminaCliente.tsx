import { Button, Group, Modal, Text } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getGetAllCustomersQueryKey, useDeleteCustomer, type CustomerResponse } from '../../api'
import { getAxiosErrorMessage } from '../../utils/errorUtils'

interface Props {
    cliente: CustomerResponse | null
    onClose: () => void
}

export default function ModalEliminaCliente({ cliente, onClose }: Props) {
    const queryClient = useQueryClient()
    const { mutate: deleteCliente, isPending } = useDeleteCustomer({
        mutation: {
            onSuccess: () => {
                toast.success('Cliente eliminato')
                queryClient.invalidateQueries({ queryKey: getGetAllCustomersQueryKey() })
                onClose()
            },
            onError: (e) => toast.error(getAxiosErrorMessage(e)),
        }
    })

    return (
        <Modal opened={cliente !== null} onClose={onClose} title="Conferma eliminazione" size="sm">
            <Text mb="lg">
                Sei sicuro di voler eliminare <strong>{cliente?.nome} {cliente?.cognome}</strong>? L'operazione non è reversibile.
            </Text>
            <Group justify="flex-end">
                <Button variant="default" onClick={onClose}>Annulla</Button>
                <Button color="red" loading={isPending} onClick={() => cliente && deleteCliente({ id: cliente.id })}>Elimina</Button>
            </Group>
        </Modal>
    )
}
