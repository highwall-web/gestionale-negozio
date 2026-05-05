import { Button, Group, Modal, Text } from '@mantine/core'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getGetAllInterventionsQueryKey, useDeleteIntervention, type InterventionResponse } from '../../api'

interface Props {
    intervento: InterventionResponse | null
    onClose: () => void
}

export default function ModalEliminaIntervento({ intervento, onClose }: Props) {
    const queryClient = useQueryClient()
    const { mutate: deleteIntervento, isPending } = useDeleteIntervention({
        mutation: {
            onSuccess: () => {
                toast.success('Intervento eliminato')
                queryClient.invalidateQueries({ queryKey: getGetAllInterventionsQueryKey() })
                onClose()
            },
            onError: () => toast.error('Errore durante l\'eliminazione'),
        }
    })

    return (
        <Modal opened={intervento !== null} onClose={onClose} title="Conferma eliminazione" size="sm">
            <Text mb="lg">
                Sei sicuro di voler eliminare <strong>{intervento?.nome}</strong>? L'operazione non è reversibile.
            </Text>
            <Group justify="flex-end">
                <Button variant="default" onClick={onClose}>Annulla</Button>
                <Button color="red" loading={isPending} onClick={() => intervento && deleteIntervento({ id: intervento.id })}>Elimina</Button>
            </Group>
        </Modal>
    )
}
