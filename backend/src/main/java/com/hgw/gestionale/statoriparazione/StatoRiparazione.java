package com.hgw.gestionale.statoriparazione;

public enum StatoRiparazione {
    ACCETTATO("Accettato"),
    ANALISI_IN_CORSO("Analisi in corso"),
    RIPARAZIONE_IN_CORSO("Riparazione in corso"),
    ATTESA_PEZZI_DI_RICAMBIO("Attesa pezzi di ricambio"),
    IN_ATTESA_DI_PREVENTIVO("In attesa di preventivo"),
    PREVENTIVO_NON_ACCETTATO("Preventivo non accettato"),
    RIPARAZIONE_CONCLUSA("Riparazione conclusa"),
    DISPOSITIVO_NON_RIPARABILE("Dispositivo non riparabile");

    private final String label;

    StatoRiparazione(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
