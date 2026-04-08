import { ActionIcon, Group, Paper } from '@mantine/core';
import { Schedule, type ScheduleEventData, type ScheduleLabels } from '@mantine/schedule';
import dayjs from 'dayjs';
import { useState, useMemo } from 'react';
import CalendarioModal from '../components/calendario/ModalCalendario';
import ModalModificaRiconsegna from '../components/calendario/ModalModificaRiconsegna';
import ModalModificaEvento from '../components/calendario/ModalModificaEvento';
import { getGetRepairsByRangeDataConsegnaQueryKey, getGetEventsByRangeDataQueryKey, useGetEventsByRangeData, useGetRepairsByRangeDataConsegna, useUpdateDataConsegna, useUpdateEvent, type RepairRangeResponse, type EventResponse } from '../api';
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
    const [selectedEvento, setSelectedEvento] = useState<EventResponse | null>(null)
    const year = dayjs(selectedDate).year()
    const { data: repairs = [] } = useGetRepairsByRangeDataConsegna(
        { from: `${year - 1}-01-01`, to: `${year + 1}-12-31` },
        { query: { staleTime: 5 * 60 * 1000 } }
    )
    const { data: eventi = [] } = useGetEventsByRangeData(
        { from: `${year - 1}-01-01`, to: `${year + 1}-12-31` },
        { query: { staleTime: 5 * 60 * 1000 } }
    )
    const { mutate: updateEvento } = useUpdateEvent({
        mutation: {
            onMutate: async ({ id, data }) => {
                await queryClient.cancelQueries({ queryKey: getGetEventsByRangeDataQueryKey() })
                const previousData = queryClient.getQueriesData<EventResponse[]>({ queryKey: getGetEventsByRangeDataQueryKey() })
                queryClient.setQueriesData<EventResponse[]>(
                    { queryKey: getGetEventsByRangeDataQueryKey() },
                    old => old?.map(e => e.id === id ? { ...e, dataEvento: data.dataEvento, oraInizio: data.oraInizio, oraFine: data.oraFine } : e)
                )
                return { previousData }
            },
            onError: (_err, _vars, context) => {
                context?.previousData.forEach(([key, data]) => queryClient.setQueryData(key, data))
                toast.error('Errore durante il salvataggio')
            },
            onSuccess: () => toast.success('Evento aggiornato'),
            onSettled: () => queryClient.invalidateQueries({ queryKey: getGetEventsByRangeDataQueryKey() }),
        }
    })
    const { mutate: updateDetailsDate } = useUpdateDataConsegna({
        mutation: {
            onMutate: async ({ repairId, data }) => {
                await queryClient.cancelQueries({ queryKey: getGetRepairsByRangeDataConsegnaQueryKey() })
                const previousData = queryClient.getQueriesData<RepairRangeResponse[]>({ queryKey: getGetRepairsByRangeDataConsegnaQueryKey() })
                queryClient.setQueriesData<RepairRangeResponse[]>(
                    { queryKey: getGetRepairsByRangeDataConsegnaQueryKey() },
                    old => old?.map(r => r.id === repairId ? { ...r, dataConsegna: data.dataConsegna ?? r.dataConsegna } : r)
                )
                return { previousData }
            },
            onError: (_err, _vars, context) => {
                context?.previousData.forEach(([key, data]) => queryClient.setQueryData(key, data))
                toast.error('Errore durante il salvataggio')
            },
            onSuccess: () => toast.success('Data di riconsegna aggiornata'),
            onSettled: () => queryClient.invalidateQueries({ queryKey: getGetRepairsByRangeDataConsegnaQueryKey() }),
        }
    })
    const events = useMemo<ScheduleEventData[]>(() => [
        ...repairs.map(r => ({
            id: r.id,
            title: `Riconsegna: ${r.nomeCliente} ${r.cognomeCliente} — ${r.brand} ${r.modello}, ${r.colore}`,
            start: r.dataConsegna,
            end: dayjs(r.dataConsegna).add(45, 'minute').format('YYYY-MM-DD HH:mm:ss'),
            color: 'blue',
            payload: { tipo: 'riparazione' as const },
        })),
        ...eventi.map(e => ({
            id: `evento-${e.id}`,
            title: e.descrizione,
            start: `${e.dataEvento} ${e.oraInizio}:00`,
            end: `${e.dataEvento} ${e.oraFine}:00`,
            color: 'green',
            payload: { tipo: 'evento' as const },
        })),
    ], [repairs, eventi])

    const handleClose = () => {
        setModalDatetime(null)
        setSelectedRepair(null)
        setSelectedEvento(null)
    }

    const handleSlotDragEnd = (event: ScheduleEventData, newStart: string) => {
        if (event.payload?.tipo === 'evento') {
            const eventoId = Number(String(event.id).replace('evento-', ''))
            const evento = eventi.find(e => e.id === eventoId)
            if (!evento) return
            const newDay = dayjs(newStart)
            const originalStart = dayjs(`${evento.dataEvento} ${evento.oraInizio}`)
            const originalEnd = dayjs(`${evento.dataEvento} ${evento.oraFine}`)
            const duration = originalEnd.diff(originalStart, 'minute')
            updateEvento({
                id: eventoId,
                data: {
                    descrizione: evento.descrizione,
                    dataEvento: newDay.format('YYYY-MM-DD'),
                    oraInizio: newDay.format('HH:mm'),
                    oraFine: newDay.add(duration, 'minute').format('HH:mm'),
                }
            })
        } else {
            updateDetailsDate({
                repairId: String(event.id),
                data: { dataConsegna: dayjs(newStart).toISOString() }
            })
        }
    };

    return (
        <>
            <CalendarioModal
                opened={modalDatetime !== null}
                onClose={handleClose}
                datetime={modalDatetime}
            />
            {selectedRepair && (
                <ModalModificaRiconsegna
                    opened
                    onClose={handleClose}
                    repair={selectedRepair}
                />
            )}
            {selectedEvento && (
                <ModalModificaEvento
                    opened
                    onClose={handleClose}
                    evento={selectedEvento}
                />
            )}
            <Paper radius={12} p="md">
                <Schedule
                    events={events}
                    onTimeSlotClick={({ slotStart }) => setModalDatetime(slotStart)}
                    onDayClick={(d) => setModalDatetime(d)}
                    onEventDrop={({ event, newStart }) => handleSlotDragEnd(event, newStart)}
                    onEventClick={(event) => {
                        if (event.payload?.tipo === 'riparazione') {
                            const repair = repairs.find(r => r.id === String(event.id))
                            if (repair) setSelectedRepair(repair)
                        } else if (event.payload?.tipo === 'evento') {
                            const eventoId = Number(String(event.id).replace('evento-', ''))
                            const evento = eventi.find(e => e.id === eventoId)
                            if (evento) setSelectedEvento(evento)
                        }
                    }}
                    labels={labels}
                    onDateChange={setSelectedDate}
                    layout='responsive'
                    dayViewProps={{ businessHours: ['09:00:00', '20:00:00'], startTime: "09:00:00", endTime: "20:00:00" }}
                    weekViewProps={{ businessHours: ['09:00:00', '20:00:00'], startTime: "09:00:00", endTime: "20:00:00" }}
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
