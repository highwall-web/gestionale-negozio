package com.hgw.gestionale.statorepair;

public enum StatoRepair {
    NUOVO("Nuovo"),
    IN_CORSO("In corso"),
    PRONTO("Pronto");

    private final String label;

    StatoRepair(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
