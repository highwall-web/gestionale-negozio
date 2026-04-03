import { Paper } from '@mantine/core';
import { Schedule, type ScheduleEventData, type ScheduleLabels, type ScheduleViewLevel, getStartOfWeek, getEndOfWeek, getMonthRange } from '@mantine/schedule';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import CalendarioModal from '../components/calendario/ModalCalendario';
import { useGetRepairsByRangeDataConsegna } from '../api';

const labels: Partial<ScheduleLabels> = {
    allDay: "Tutto il giorno",
    day: "Giorno",
    week: "Settimana",
    year: "Anno",
    month: "Mese",
    today: "Oggi"
}

export default function Calendario() {
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))
    const [view, setView] = useState<ScheduleViewLevel>('week')
    const [modalDatetime, setModalDatetime] = useState<string | null>(null)

    const range = useMemo(() => {
        switch (view) {
            case 'day':
                return { start: date, end: date }
            case 'week':
                return { start: getStartOfWeek({ date }), end: getEndOfWeek(date) as string }
            case 'month':
                return getMonthRange({ month: date, withOutsideDays: false, consistentWeeks: undefined, firstDayOfWeek: 1 })
            case 'year':
                return { start: `${dayjs(date).year()}-01-01`, end: `${dayjs(date).year()}-12-31` }
        }
    }, [date, view])

    const { data: repairs = [] } = useGetRepairsByRangeDataConsegna({ from: range.start, to: range.end })

    const events = useMemo<ScheduleEventData[]>(() => repairs.map(r => ({
        id: String(r.id),
        title: `Riconsegna: ${r.nomeCliente} ${r.cognomeCliente} — ${r.brand} ${r.modello}, ${r.colore} `,
        start: r.dataConsegna,
        end: dayjs(r.dataConsegna).add(45, 'minute').format('YYYY-MM-DD HH:mm:ss'),
        color: 'cyan',
    })), [repairs])

    return (
        <>
            <CalendarioModal
                opened={modalDatetime !== null}
                onClose={() => setModalDatetime(null)}
                datetime={modalDatetime}
            />
            <Paper radius={12} p="md">
                <Schedule
                    labels={labels}
                    date={date}
                    onDateChange={setDate}
                    view={view}
                    onViewChange={setView}
                    layout='responsive'
                    events={events}
                    monthViewProps={{ withOutsideDays: false }}
                    yearViewProps={{ withOutsideDays: false }}
                    onDayClick={(d) => setModalDatetime(d)}
                    onTimeSlotClick={({ slotStart }) => setModalDatetime(slotStart)}
                />
            </Paper>
        </>
    )
}
