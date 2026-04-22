import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { getGetAllModelsPaginatedQueryKey, TipoDispositivo, useSearchBrands, useUpdateModel, type ModelResponse } from '../../api'

const TIPO_OPTIONS = [
    { value: TipoDispositivo.TELEFONO, label: 'Telefono' },
    { value: TipoDispositivo.TABLET, label: 'Tablet' },
    { value: TipoDispositivo.COMPUTER, label: 'Computer' },
]

interface Props {
    opened: boolean
    onClose: () => void
    modello: ModelResponse
}

export default function ModalModificaModello({ opened, onClose, modello }: Props) {
    const [nome, setNome] = useState(modello.nome)
    const [tipoDispositivo, setTipoDispositivo] = useState<TipoDispositivo>(modello.tipoDispositivo)
    const [brandId, setBrandId] = useState<string>(String(modello.brandId))
    const [brandSearch, setBrandSearch] = useState(modello.brandNome)
    const [debouncedBrandSearch] = useDebouncedValue(brandSearch, 400)

    const { data: brands = [] } = useSearchBrands(
        { nome: debouncedBrandSearch },
        { query: { enabled: debouncedBrandSearch.length >= 2 } }
    )
    const brandOptions = brands.map(b => ({ value: String(b.id), label: b.nome }))

    const queryClient = useQueryClient()
    const { mutate: updateModello, isPending } = useUpdateModel({
        mutation: {
            onSuccess: () => {
                toast.success('Modello aggiornato')
                queryClient.invalidateQueries({ queryKey: getGetAllModelsPaginatedQueryKey() })
                onClose()
            },
            onError: () => toast.error('Errore durante il salvataggio'),
        }
    })

    const handleReset = () => {
        setNome(modello.nome)
        setTipoDispositivo(modello.tipoDispositivo)
        setBrandId(String(modello.brandId))
        setBrandSearch(modello.brandNome)
    }

    const handleSalva = () => {
        if (!nome || !brandId) return
        updateModello({ id: modello.id, data: { nome, tipoDispositivo, brandId: Number(brandId) } })
    }

    return (
        <Modal opened={opened} onClose={onClose} title="Modifica modello" size="md">
            <Stack>
                <TextInput
                    label="Nome"
                    value={nome}
                    onChange={e => setNome(e.currentTarget.value)}
                    withAsterisk
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
                    value={brandId}
                    onChange={v => { if (v) setBrandId(v) }}
                    onSearchChange={setBrandSearch}
                    searchValue={brandSearch}
                    searchable
                    withAsterisk
                    nothingFoundMessage={debouncedBrandSearch.length < 2 ? 'Digita almeno 2 caratteri' : 'Nessun brand trovato'}
                />
                <Group justify="space-between">
                    <Button variant="light" color="red" onClick={handleReset}>Reset</Button>
                    <Button.Group>
                        <Button variant="default" onClick={onClose}>Annulla</Button>
                        <Button loading={isPending} disabled={!nome || !brandId} onClick={handleSalva}>Salva</Button>
                    </Button.Group>
                </Group>
            </Stack>
        </Modal>
    )
}
