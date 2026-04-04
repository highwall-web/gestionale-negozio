import { ActionIcon, Group, Paper } from '@mantine/core';
import { Schedule, type ScheduleEventData, type ScheduleLabels } from '@mantine/schedule';
import dayjs from 'dayjs';
import { useState, useMemo } from 'react';
import CalendarioModal from '../components/calendario/ModalCalendario';
import { getGetRepairsByRangeDataConsegnaQueryKey, useGetRepairsByRangeDataConsegna, useUpdateDataConsegna, type RepairRangeResponse } from '../api';
import { IconPlus } from '@tabler/icons-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

const labels: Partial<ScheduleLabels> = {
    allDay: "Tutto il giorno",
    day: "Giorno",
    week: "Settimana",
    year: "Anno",
    month: "Mese",
    today: "Oggi"
}

export default function Calendario() {
    const queryClient = useQueryClient()
    const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'))
    const [modalDatetime, setModalDatetime] = useState<string | null>(null)
    const [selectedRepair, setSelectedRepair] = useState<RepairRangeResponse | null>(null)
    const { mutate: updateDetailsDate } = useUpdateDataConsegna({
        mutation: {
            onSuccess: () => {
                toast.success('Data di riconsegna aggiornata')
                queryClient.invalidateQueries({ queryKey: getGetRepairsByRangeDataConsegnaQueryKey() })
            },
            onError: () => toast.error('Errore durante il salvataggio')
        }
    })

    const year = dayjs(selectedDate).year()

    const { data: repairs = [] } = useGetRepairsByRangeDataConsegna(
        { from: `${year}-01-01`, to: `${year}-12-31` },
        { query: { staleTime: 5 * 60 * 1000 } }
    )

    const events = useMemo<ScheduleEventData[]>(() => repairs.map(r => ({
        id: String(r.id),
        title: `Riconsegna: ${r.nomeCliente} ${r.cognomeCliente} — ${r.brand} ${r.modello}, ${r.colore} `,
        start: r.dataConsegna,
        end: dayjs(r.dataConsegna).add(45, 'minute').format('YYYY-MM-DD HH:mm:ss'),
        color: 'blue',
    })), [repairs])

    const handleClose = () => {
        setModalDatetime(null)
        setSelectedRepair(null)
    }

    const handleSlotDragEnd = (event: ScheduleEventData, newStart: string) => {
        updateDetailsDate({
            repairId: Number(event.id),
            data: {
                dataConsegna: dayjs(newStart).toISOString()
            }
        })
    };

    return (
        <>
            <CalendarioModal
                opened={modalDatetime !== null || selectedRepair !== null}
                onClose={handleClose}
                datetime={modalDatetime}
                selectedRepair={selectedRepair}
            />
            <Paper radius={12} p="md">
                <Schedule
                    events={events}
                    onTimeSlotClick={({ slotStart }) => setModalDatetime(slotStart)}
                    onDayClick={(d) => setModalDatetime(d)}
                    onEventDrop={({ event, newStart }) => handleSlotDragEnd(event, newStart)}
                    onEventClick={(event) => {
                        const repair = repairs.find(r => String(r.id) === event.id)
                        if (repair) setSelectedRepair(repair)
                    }}
                    labels={labels}
                    onDateChange={setSelectedDate}
                    layout='responsive'
                    monthViewProps={{ withOutsideDays: false }}
                    yearViewProps={{ withOutsideDays: false }}
                    withEventsDragAndDrop
                    mobileMonthViewProps={{
                        onSelectedDateChange: (date) => { if (date) setSelectedDate(date) },
                        renderHeader: ({ defaultHeader }) => (
                            <Group justify="space-between" w="100%">
                                <Group justify="space-between" flex="1">
                                    {defaultHeader}
                                </Group>
                                <ActionIcon
                                    variant="default"
                                    mx="sm"
                                    size="lg"
                                    onClick={() => setModalDatetime(selectedDate)}
                                    aria-label="Nuovo evento"
                                >
                                    <IconPlus size={18} />
                                </ActionIcon>
                            </Group>
                        ),
                    }}
                />
            </Paper>
        </>
    )
}
