import { Button, Group, Modal, NumberInput, Select, Stack, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { getGetAllInterventionsQueryKey, useSearchModels, useUpdateIntervention, type InterventionResponse } from '../../api'

interface Props {
    opened: boolean
    onClose: () => void
    intervento: InterventionResponse
}

export default function ModalModificaIntervento({ opened, onClose, intervento }: Props) {
    const [nome, setNome] = useState(intervento.nome)
    const [prezzo, setPrezzo] = useState<number>(intervento.prezzo)
    const [periodoGaranzia, setPeriodoGaranzia] = useState<number | ''>(intervento.periodoGaranzia ?? '')
    const [modelId, setModelId] = useState<string | null>(intervento.modelId != null ? String(intervento.modelId) : null)

    const [modelSearch, setModelSearch] = useState(intervento.modelNome ?? '')
    const [debouncedModelSearch] = useDebouncedValue(modelSearch, 400)
    const { data: models = [] } = useSearchModels(
        { nome: debouncedModelSearch },
        { query: { enabled: debouncedModelSearch.length >= 2 } }
    )
    const modelOptions = models.map(m => ({ value: String(m.id), label: `${m.brandNome} ${m.nome}` }))

    const queryClient = useQueryClient()
    const { mutate: updateIntervento, isPending } = useUpdateIntervention({
        mutation: {
            onSuccess: () => {
                toast.success('Intervento aggiornato')
                queryClient.invalidateQueries({ queryKey: getGetAllInterventionsQueryKey() })
                onClose()
            },
            onError: () => toast.error('Errore durante il salvataggio'),
        }
    })

    const handleReset = () => {
        setNome(intervento.nome)
        setPrezzo(intervento.prezzo)
        setPeriodoGaranzia(intervento.periodoGaranzia ?? '')
        setModelId(intervento.modelId != null ? String(intervento.modelId) : null)
        setModelSearch(intervento.modelNome ?? '')
    }

    const handleSalva = () => {
        if (!nome || prezzo == null) return
        updateIntervento({
            id: intervento.id,
            data: {
                nome,
                prezzo,
                modelId: modelId ? Number(modelId) : null,
                periodoGaranzia: periodoGaranzia !== '' ? Number(periodoGaranzia) : null,
            }
        })
    }

    return (
        <Modal opened={opened} onClose={onClose} title="Modifica intervento" size="md">
            <Stack>
                <TextInput
                    label="Nome"
                    value={nome}
                    onChange={e => setNome(e.currentTarget.value)}
                />
                <Select
                    label="Modello"
                    placeholder="Generale (nessun modello)"
                    data={modelOptions}
                    value={modelId}
                    onChange={setModelId}
                    onSearchChange={setModelSearch}
                    searchValue={modelSearch}
                    searchable
                    clearable
                    nothingFoundMessage={debouncedModelSearch.length < 2 ? 'Digita almeno 2 caratteri' : 'Nessun modello trovato'}
                />
                <NumberInput
                    label="Prezzo (€)"
                    value={prezzo}
                    onChange={v => setPrezzo(Number(v))}
                    min={0}
                    decimalScale={2}
                    fixedDecimalScale
                    prefix="€ "
                />
                <NumberInput
                    label="Garanzia (giorni)"
                    value={periodoGaranzia}
                    onChange={v => setPeriodoGaranzia(v === '' ? '' : Number(v))}
                    min={0}
                    allowDecimal={false}
                />
                <Group justify="space-between">
                    <Button variant="light" color="red" onClick={handleReset}>Reset</Button>
                    <Button.Group>
                        <Button variant="default" onClick={onClose}>Annulla</Button>
                        <Button
                            loading={isPending}
                            disabled={!nome}
                            onClick={handleSalva}
                        >
                            Salva
                        </Button>
                    </Button.Group>
                </Group>
            </Stack>
        </Modal>
    )
}
