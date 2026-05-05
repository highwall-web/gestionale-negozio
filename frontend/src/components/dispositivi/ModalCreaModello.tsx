import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { getGetAllModelsPaginatedQueryKey, TipoDispositivo, useCreateModel, useSearchBrands } from '../../api'

const TIPO_OPTIONS = [
    { value: TipoDispositivo.TELEFONO, label: 'Telefono' },
    { value: TipoDispositivo.TABLET, label: 'Tablet' },
    { value: TipoDispositivo.COMPUTER, label: 'Computer' },
]

interface Props {
    opened: boolean
    onClose: () => void
}

export default function ModalCreaModello({ opened, onClose }: Props) {
    const [nome, setNome] = useState('')
    const [tipoDispositivo, setTipoDispositivo] = useState<TipoDispositivo>(TipoDispositivo.TELEFONO)
    const [brandSearch, setBrandSearch] = useState('')
    const [brandNome, setBrandNome] = useState('')
    const [debouncedBrandSearch] = useDebouncedValue(brandSearch, 400)

    const { data: brands = [] } = useSearchBrands(
        { nome: debouncedBrandSearch },
        { query: { enabled: debouncedBrandSearch.length >= 2 } }
    )
    const brandOptions = brands.map(b => ({ value: b.nome, label: b.nome }))

    const queryClient = useQueryClient()
    const { mutate: createModello, isPending } = useCreateModel({
        mutation: {
            onSuccess: () => {
                toast.success('Modello creato')
                queryClient.invalidateQueries({ queryKey: getGetAllModelsPaginatedQueryKey() })
                setNome('')
                setBrandSearch('')
                setBrandNome('')
                setTipoDispositivo(TipoDispositivo.TELEFONO)
                onClose()
            },
            onError: () => toast.error('Errore durante il salvataggio'),
        }
    })

    const handleSalva = () => {
        if (!nome || !brandNome) return
        createModello({ data: { nome, tipoDispositivo, brandNome } })
    }

    return (
        <Modal opened={opened} onClose={onClose} title="Nuovo modello" size="md">
            <Stack>
                <TextInput
                    label="Nome"
                    value={nome}
                    onChange={e => setNome(e.currentTarget.value)}
                    withAsterisk
                    data-autofocus
                />
                <Select
                    label="Tipo dispositivo"
                    data={TIPO_OPTIONS}
                    value={tipoDispositivo}
                    onChange={v => { if (v) setTipoDispositivo(v as TipoDispositivo) }}
                    withAsterisk
                />
                <Select
                    label="Brand"
                    placeholder="Cerca brand..."
                    data={brandOptions}
                    value={brandNome || null}
                    onChange={v => { setBrandNome(v ?? ''); setBrandSearch(v ?? '') }}
                    onSearchChange={setBrandSearch}
                    searchValue={brandSearch}
                    searchable
                    withAsterisk
                    nothingFoundMessage={debouncedBrandSearch.length < 2 ? 'Digita almeno 2 caratteri' : 'Nessun brand trovato'}
                />
                <Group justify="flex-end">
                    <Button.Group>
                        <Button variant="default" onClick={onClose}>Annulla</Button>
                        <Button loading={isPending} disabled={!nome || !brandNome} onClick={handleSalva}>Crea</Button>
                    </Button.Group>
                </Group>
            </Stack>
        </Modal>
    )
}
