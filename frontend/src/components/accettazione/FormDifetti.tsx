import { Accordion, Badge, Checkbox, Group, SimpleGrid, Title, Text, Button } from "@mantine/core"
import { useState, type SyntheticEvent } from "react"
import { useResetOnEditEnd } from '../../hooks/useResetOnEditEnd'
import toast from "react-hot-toast"
import { useAccettazione } from "../../context/AccettazioneContext"
import type { RecordStringStringArray } from "../../api"

const CATEGORIE: Record<string, string[]> = {
    "Estetica": [
        "Graffi sul corpo",
        "Crepe sul vetro posteriore",
        "Cornice danneggiata",
        "Porta di ricarica danneggiata",
    ],
    "Display": [
        "Schermo rotto/screpolato",
        "Touchscreen non risponde",
        "3D touch non funziona",
        "Pixel difettosi/righe",
    ],
    "Tasti": [
        "Tasto power non funzionante (o non clicca bene)",
        "Volume su non funzionante (o non clicca bene)",
        "Volume giù non funzionante (o non clicca bene)",
        "Tasto home non funzionante (o non clicca bene)",
        "Tasto mute non funzionante (o non clicca bene)",
    ],
    "Audio": [
        "Microfono non funzionante",
        "Altoparlante non funzionante",
        "Auricolare non funzionante",
        "Jack cuffie non funzionante",
        "Microfono secondario non funzionante",
    ],
    "Alimentazione": [
        "Non si carica",
        "Scarica velocemente",
        "Batteria gonfia",
        "Porta di ricarica difettosa",
        "Ricarica wireless non funzionante",
    ],
    "Fotocamere": [
        "Camera frontale non funzionante",
        "Camera posteriore non funzionante",
        "Flash non funzionante",
        "Immagini sfocate",
        "True depth non funziona (Apple)"
    ],
    "Sensori": [
        "Sensore di prossimità non funzionante",
        "Sensore di luminosità non funzionante",
        "Giroscopio non funzionante",
        "True tone non funzionante (Apple)"
    ],
    "Connettività": [
        "WiFi non funzionante",
        "Bluetooth non funzionante",
        "4G/5G non funzionante",
        "GPS non funzionante",
        "NFC non funzionante",
        "SIM non rilevata",
        "Micro SD non rilevata"
    ],
    "Sicurezza": [
        "Face ID non funzionante",
        "Touch ID non funzionante",
    ],
}

interface Props {
    onSuccess: (testDiagnostici: RecordStringStringArray) => void
}

export default function FormDifetti({ onSuccess }: Props) {
    const { active, selectedDispositivo, updateActive, toggleEditingTest, isEditing } = useAccettazione()
    const isDisabled = active !== 3
    const [isEditable, setIsEditable] = useState(false);

    const [selectedTests, setSelectedTests] = useState<RecordStringStringArray>(
        selectedDispositivo?.testDiagnostici ?? {}
    )

    function handleChange(categoria: string, values: string[]) {
        setSelectedTests(prev => ({ ...prev, [categoria]: values }))
    }


    function countSelected(categoria: string) {
        return selectedTests[categoria]?.length ?? 0
    }

    const totalSelected = Object.values(selectedTests).reduce((acc, v) => acc + v.length, 0)

    function handleSubmit(e: SyntheticEvent) {
        e.preventDefault()
        toast.success("Test diagnostici salvati")
        handleToggleEditing();
        setIsEditable(true);
        onSuccess(selectedTests)
    }

    function handleReset() {
        setSelectedTests({})
    }

    function handleUndo() {
        if (!selectedDispositivo?.testDiagnostici) return;
        resetToSelected();
        onSuccess(selectedDispositivo?.testDiagnostici);
        handleToggleEditing();
    }

    function handleToggleEditing() {
        if (!isEditing.editingTest) return;
        toggleEditingTest()
    }

    function resetToSelected() {
        if (!selectedDispositivo?.testDiagnostici) return
        setSelectedTests(selectedDispositivo.testDiagnostici)
    }

    useResetOnEditEnd(isEditing.editingTest, resetToSelected)

    return (
        <form onSubmit={handleSubmit}>
            <Group justify="space-between" mb="md">
                <Title order={4}>Test diagnostici</Title>
                {totalSelected > 0 && (
                    <Badge color="red" variant="light">{totalSelected} difetti rilevati</Badge>
                )}
            </Group>
            <Accordion multiple variant="separated" chevronPosition="left">
                {Object.entries(CATEGORIE).map(([categoria, opzioni]) => {
                    const count = countSelected(categoria)
                    return (
                        <Accordion.Item key={categoria} value={categoria}>
                            <Accordion.Control>
                                <Group justify="space-between" pr="sm">
                                    <Text size="sm" fw={500}>{categoria}</Text>
                                    {count > 0 && (
                                        <Badge size="sm" color="red" variant="light">{count}</Badge>
                                    )}
                                </Group>
                            </Accordion.Control>
                            <Accordion.Panel>
                                <Checkbox.Group
                                    value={selectedTests[categoria] ?? []}
                                    onChange={values => handleChange(categoria, values)}
                                >
                                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
                                        {opzioni.map(opzione => (
                                            <Checkbox
                                                key={opzione}
                                                value={opzione}
                                                label={opzione}
                                                disabled={isDisabled}
                                            />
                                        ))}
                                    </SimpleGrid>
                                </Checkbox.Group>
                            </Accordion.Panel>
                        </Accordion.Item>
                    )
                })}
            </Accordion>
            <Group justify="flex-end" mt="xl">
                <Button.Group>
                    {active === 3 && (
                        <>
                            <Button variant="default" type="button" onClick={handleReset}>
                                Reset
                            </Button>
                            {
                                !isEditing.editingTest ? (
                                    <Button type="submit">
                                        Conferma test diagnostici
                                    </Button>
                                ) : (
                                    <Button
                                        type={"button"}
                                        onClick={(e) => { e.preventDefault(); handleUndo() }}
                                        variant="outline"
                                    >
                                        Annulla modifiche
                                    </Button>
                                )
                            }

                            {
                                isEditing.editingTest && (
                                    <Button type="submit">
                                        {"Applica modifiche"}
                                    </Button>
                                )
                            }
                        </>
                    )}
                    {(isDisabled && isEditable) && (
                        <Button type='button' onClick={(e) => { e.preventDefault(); updateActive(3); toggleEditingTest() }}>
                            Modifica test diagnostici
                        </Button>
                    )}
                </Button.Group>
            </Group>
        </form>
    )
}
