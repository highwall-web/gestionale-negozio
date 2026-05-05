import { Button, Group, Modal, NumberInput, Select, Stack, Switch, TextInput } from '@mantine/core'
import { useDebouncedValue } from '@mantine/hooks'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { getGetAllInterventionsQueryKey, useCreateIntervention, useSearchModels } from '../../api'

interface Props {
    opened: boolean
    onClose: () => void
}

export default function ModalCreaIntervento({ opened, onClose }: Props) {
    const [nome, setNome] = useState('')
    const [prezzo, setPrezzo] = useState<number>(0)
    const [periodoGaranzia, setPeriodoGaranzia] = useState<number | ''>('')
    const [isGenerale, setIsGenerale] = useState(true)
    const [modelId, setModelId] = useState<string | null>(null)
    const [modelSearch, setModelSearch] = useState('')
    const [debouncedModelSearch] = useDebouncedValue(modelSearch, 400)

    const { data: models = [] } = useSearchModels(
        { nome: debouncedModelSearch },
        { query: { enabled: debouncedModelSearch.length >= 2 } }
    )
    const modelOptions = models.map(m => ({ value: String(m.id), label: `${m.brandNome} ${m.nome}` }))

    const queryClient = useQueryClient()
    const { mutate: createIntervento, isPending } = useCreateIntervention({
        mutation: {
            onSuccess: () => {
                toast.success('Intervento creato')
                queryClient.invalidateQueries({ queryKey: getGetAllInterventionsQueryKey() })
                handleClose()
            },
            onError: () => toast.error('Errore durante il salvataggio'),
        }
    })

    function handleClose() {
        setNome('')
        setPrezzo(0)
        setPeriodoGaranzia('')
        setIsGenerale(true)
        setModelId(null)
        setModelSearch('')
        onClose()
    }

    const handleSalva = () => {
        if (!nome) return
        if (!isGenerale && !modelId) return
        createIntervento({
            data: {
                nome,
                prezzo,
                modelId: modelId ? Number(modelId) : undefined,
                periodoGaranzia: periodoGaranzia !== '' ? Number(periodoGaranzia) : undefined,
            }
        })
    }

    return (
        <Modal opened={opened} onClose={handleClose} title="Nuovo intervento" size="md">
            <Stack>
                <TextInput
                    label="Nome"
                    value={nome}
                    onChange={e => setNome(e.currentTarget.value)}
                    withAsterisk
                    data-autofocus
                />
                <Switch
                    label="Intervento generale (nessun modello specifico)"
                    checked={isGenerale}
                    onChange={e => {
                        const checked = e.currentTarget.checked
                        setIsGenerale(checked)
                        if (checked) {
                            setModelId(null)
                            setModelSearch('')
                        }
                    }}
                />
                {!isGenerale && (
                    <Select
                        label="Modello"
                        placeholder="Cerca modello..."
                        data={modelOptions}
                        value={modelId}
                        onChange={setModelId}
                        onSearchChange={setModelSearch}
                        searchValue={modelSearch}
                        searchable
                        clearable
                        withAsterisk
                        nothingFoundMessage={debouncedModelSearch.length < 2 ? 'Digita almeno 2 caratteri' : 'Nessun modello trovato'}
                    />
                )}
                <NumberInput
                    label="Prezzo (€)"
                    value={prezzo}
                    onChange={v => setPrezzo(Number(v))}
                    min={0}
                    decimalScale={2}
                    fixedDecimalScale
                    prefix="€ "
                    withAsterisk
                />
                <NumberInput
                    label="Garanzia (mesi)"
                    value={periodoGaranzia}
                    onChange={v => setPeriodoGaranzia(v === '' ? '' : Number(v))}
                    min={0}
                    allowDecimal={false}
                />
                <Group justify="flex-end">
                    <Button.Group>
                        <Button variant="default" onClick={handleClose}>Annulla</Button>
                        <Button
                            loading={isPending}
                            disabled={!nome || (!isGenerale && !modelId)}
                            onClick={handleSalva}
                        >
                            Crea
                        </Button>
                    </Button.Group>
                </Group>
            </Stack>
        </Modal>
    )
}
