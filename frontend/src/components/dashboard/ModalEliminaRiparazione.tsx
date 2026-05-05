import { Button, Group, Modal, Text } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getGetAllRepairsQueryKey, useDeleteRepair, type RepairResponse } from '../../api'

interface Props {
    riparazione: RepairResponse | null
    onClose: () => void
}

export default function ModalEliminaRiparazione({ riparazione, onClose }: Props) {
    const queryClient = useQueryClient()
    const { mutate: deleteRiparazione, isPending } = useDeleteRepair({
        mutation: {
            onSuccess: () => {
                toast.success('Riparazione eliminata')
                queryClient.invalidateQueries({ queryKey: getGetAllRepairsQueryKey() })
                onClose()
            },
            onError: () => toast.error('Errore durante l\'eliminazione'),
        }
    })

    return (
        <Modal opened={riparazione !== null} onClose={onClose} title="Conferma eliminazione" size="sm">
            <Text mb="lg">
                Sei sicuro di voler eliminare la riparazione di <strong>{riparazione?.customer.nome} {riparazione?.customer.cognome}</strong>? L'operazione non è reversibile.
            </Text>
            <Group justify="flex-end">
                <Button variant="default" onClick={onClose}>Annulla</Button>
                <Button color="red" loading={isPending} onClick={() => riparazione && deleteRiparazione({ id: riparazione.id })}>Elimina</Button>
            </Group>
        </Modal>
    )
}
