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
