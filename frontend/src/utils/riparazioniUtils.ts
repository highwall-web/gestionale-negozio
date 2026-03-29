import { RepairResponseStato } from '../api/models/repairResponseStato'
import { RepairResponseStatoRiparazione } from '../api/models/repairResponseStatoRiparazione'
import { UpdateRepairRequestStatoRiparazione } from '../api/models/updateRepairRequestStatoRiparazione'

export const statoColors: Record<string, string> = {
    [RepairResponseStato.NUOVO]: 'blue',
    [RepairResponseStato.IN_CORSO]: 'orange',
    [RepairResponseStato.PRONTO]: 'green',
    [RepairResponseStato.CONSEGNATO]: 'gray',
}

export const statoRiparazioneColors: Record<string, string> = {
    [RepairResponseStatoRiparazione.ACCETTATO]: 'blue',
    [RepairResponseStatoRiparazione.ANALISI_IN_CORSO]: 'cyan',
    [RepairResponseStatoRiparazione.RIPARAZIONE_IN_CORSO]: 'orange',
    [RepairResponseStatoRiparazione.ATTESA_PEZZI_DI_RICAMBIO]: 'yellow',
    [RepairResponseStatoRiparazione.IN_ATTESA_DI_PREVENTIVO]: 'violet',
    [RepairResponseStatoRiparazione.PREVENTIVO_NON_ACCETTATO]: 'red',
    [RepairResponseStatoRiparazione.RIPARAZIONE_CONCLUSA]: 'green',
    [RepairResponseStatoRiparazione.DISPOSITIVO_NON_RIPARABILE]: 'dark',
}

export const statoSuccessivo: Partial<Record<UpdateRepairRequestStatoRiparazione, UpdateRepairRequestStatoRiparazione>> = {
    [UpdateRepairRequestStatoRiparazione.ACCETTATO]: UpdateRepairRequestStatoRiparazione.ANALISI_IN_CORSO,
    [UpdateRepairRequestStatoRiparazione.ANALISI_IN_CORSO]: UpdateRepairRequestStatoRiparazione.RIPARAZIONE_IN_CORSO,
    [UpdateRepairRequestStatoRiparazione.RIPARAZIONE_IN_CORSO]: UpdateRepairRequestStatoRiparazione.RIPARAZIONE_CONCLUSA,
    [UpdateRepairRequestStatoRiparazione.ATTESA_PEZZI_DI_RICAMBIO]: UpdateRepairRequestStatoRiparazione.RIPARAZIONE_IN_CORSO,
    [UpdateRepairRequestStatoRiparazione.IN_ATTESA_DI_PREVENTIVO]: UpdateRepairRequestStatoRiparazione.RIPARAZIONE_IN_CORSO,
}
