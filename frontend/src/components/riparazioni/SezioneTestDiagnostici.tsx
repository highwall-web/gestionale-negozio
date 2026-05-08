import { Accordion, Badge, Button, Checkbox, Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import { getGetRepairByIdQueryKey, useUpdateProductTestDiagnostici, type RecordStringStringArray } from '../../api'
import { CATEGORIE_TEST_DIAGNOSTICI } from '../../utils/testDiagnosticiUtils'

interface Props {
    repairId: string
    productId: number
    testDiagnostici?: RecordStringStringArray
}

export default function SezioneTestDiagnostici({ repairId, productId, testDiagnostici }: Props) {
    const saved = testDiagnostici ?? {}
    const [selectedTests, setSelectedTests] = useState<RecordStringStringArray>(saved)

    const queryClient = useQueryClient()
    const { mutate: updateTests, isPending } = useUpdateProductTestDiagnostici({
        mutation: {
            onSuccess: () => {
                toast.success('Test diagnostici salvati')
                queryClient.invalidateQueries({ queryKey: getGetRepairByIdQueryKey(repairId) })
            },
            onError: () => toast.error('Errore durante il salvataggio'),
        }
    })

    useEffect(() => {
        setSelectedTests(testDiagnostici ?? {})
    }, [testDiagnostici])

    const isDirty = JSON.stringify(selectedTests) !== JSON.stringify(saved)
    const totalSelected = Object.values(selectedTests).reduce((acc, v) => acc + v.length, 0)

    function handleChange(categoria: string, values: string[]) {
        setSelectedTests(prev => ({ ...prev, [categoria]: values }))
    }

    function countSelected(categoria: string) {
        return selectedTests[categoria]?.length ?? 0
    }

    function handleSave() {
        updateTests({ id: productId, data: { testDiagnostici: selectedTests } })
    }

    return (
        <Paper radius={12} p="md">
            <Stack gap="sm">
                <Group justify="space-between">
                    <Title order={5}>Test diagnostici</Title>
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
                                                <Checkbox key={opzione} value={opzione} label={opzione} />
                                            ))}
                                        </SimpleGrid>
                                    </Checkbox.Group>
                                </Accordion.Panel>
                            </Accordion.Item>
                        )
                    })}
                </Accordion>
                <Group gap="xs" justify="flex-end">
                    <Button variant="light" color="red" type="button" disabled={!isDirty || isPending} onClick={() => setSelectedTests(saved)}>Reset</Button>
                    <Button type="button" disabled={!isDirty} loading={isPending} onClick={handleSave}>Salva</Button>
                </Group>
            </Stack>
        </Paper>
    )
}
