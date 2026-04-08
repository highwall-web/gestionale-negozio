import { Modal, SegmentedControl } from '@mantine/core'
import { useState } from 'react'
import EventoPanel from './EventoPanel'
import RiconsegnaPanel from './RiconsegnaPanel'

interface Props {
    opened: boolean
    onClose: () => void
    datetime: string | null
}

type Page = 'riconsegna' | 'evento'

export default function CalendarioModal({ opened, onClose, datetime }: Props) {
    const [page, setPage] = useState<Page>('riconsegna')

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={page === 'riconsegna' ? 'Riconsegna' : 'Nuovo evento'}
            size="md"
        >
            <SegmentedControl
                fullWidth
                mb="md"
                value={page}
                onChange={v => setPage(v as Page)}
                data={[
                    { value: 'riconsegna', label: 'Data riconsegna' },
                    { value: 'evento', label: 'Evento generale' },
                ]}
            />
            {page === 'riconsegna' ? (
                <RiconsegnaPanel datetime={datetime} onClose={onClose} />
            ) : (
                <EventoPanel datetime={datetime} onClose={onClose} />
            )}
        </Modal>
    )
}
