import { StatoRepair, StatoRiparazione } from "../api"

export const statoColors: Record<string, string> = {
    [StatoRepair.NUOVO]: 'blue',
    [StatoRepair.IN_CORSO]: 'orange',
    [StatoRepair.PRONTO]: 'green',
    [StatoRepair.CONSEGNATO]: 'gray',
}

export const statoRiparazioneColors: Record<string, string> = {
    [StatoRiparazione.ACCETTATO]: 'blue',
    [StatoRiparazione.ANALISI_IN_CORSO]: 'cyan',
    [StatoRiparazione.RIPARAZIONE_IN_CORSO]: 'orange',
    [StatoRiparazione.ATTESA_PEZZI_DI_RICAMBIO]: 'yellow',
    [StatoRiparazione.IN_ATTESA_DI_PREVENTIVO]: 'violet',
    [StatoRiparazione.PREVENTIVO_NON_ACCETTATO]: 'red',
    [StatoRiparazione.RIPARAZIONE_CONCLUSA]: 'green',
    [StatoRiparazione.DISPOSITIVO_NON_RIPARABILE]: 'dark',
}

export const statoOptions = [
    { value: StatoRepair.NUOVO, label: 'Nuovo' },
    { value: StatoRepair.IN_CORSO, label: 'In corso' },
    { value: StatoRepair.PRONTO, label: 'Pronto' },
    { value: StatoRepair.CONSEGNATO, label: 'Consegnato' },
]

export const statoRiparazioneOptions = [
    { value: StatoRiparazione.ACCETTATO, label: 'Accettato' },
    { value: StatoRiparazione.ANALISI_IN_CORSO, label: 'Analisi in corso' },
    { value: StatoRiparazione.RIPARAZIONE_IN_CORSO, label: 'Riparazione in corso' },
    { value: StatoRiparazione.ATTESA_PEZZI_DI_RICAMBIO, label: 'Attesa pezzi di ricambio' },
    { value: StatoRiparazione.IN_ATTESA_DI_PREVENTIVO, label: 'In attesa di preventivo' },
    { value: StatoRiparazione.PREVENTIVO_NON_ACCETTATO, label: 'Preventivo non accettato' },
    { value: StatoRiparazione.RIPARAZIONE_CONCLUSA, label: 'Riparazione conclusa' },
    { value: StatoRiparazione.DISPOSITIVO_NON_RIPARABILE, label: 'Dispositivo non riparabile' },
]
