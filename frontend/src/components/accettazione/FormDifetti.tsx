import { Accordion, Badge, Checkbox, Group, SimpleGrid, Title, Text, Button } from "@mantine/core"
import { useState, type SyntheticEvent } from "react"
import { useResetOnEditEnd } from '../../hooks/useResetOnEditEnd'
import toast from "react-hot-toast"
import { useAccettazione } from "../../context/AccettazioneContext"
import type { RecordStringStringArray } from "../../api"
import { CATEGORIE_TEST_DIAGNOSTICI } from "../../utils/testDiagnosticiUtils"

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
                {Object.entries(CATEGORIE_TEST_DIAGNOSTICI).map(([categoria, opzioni]) => {
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
                            <Button variant="light" color="red" type="button" onClick={handleReset}>
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
