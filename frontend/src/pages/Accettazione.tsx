import { Paper, ScrollArea, Stack, Stepper } from "@mantine/core";
import { useState } from "react";
import type { CustomerResponse, ProductResponse } from "../api";
import FormCliente from "../components/accettazione/FormCliente";
import FormDispositivo from "../components/accettazione/FormDispositivo";
import FormRiparazione from "../components/accettazione/FormRiparazione";
import { useAccettazione } from "../context/AccettazioneContext";

export default function Accettazione() {

    const { active, updateActive } = useAccettazione();

    const [customerId, setCustomerId] = useState<number | null>(null);
    const [productId, setProductId] = useState<number | null>(null);

    const handleClienteSuccess = (customer: CustomerResponse) => {
        setCustomerId(customer.id!)
        updateActive(active + 1)
    }

    const handleProductSuccess = (product: ProductResponse) => {
        setProductId(product.id!)
        updateActive(active + 1)
    }

    return <div>
        <Stack gap={16}>
            <Paper radius={12} p="md" ta={'start'}>
                <Stepper active={active}>
                    <Stepper.Step label="Primo step" description="Inserisci il cliente">
                        Step 1: Inserisci il cliente
                    </Stepper.Step>
                    <Stepper.Step label="Secondo step" description="Inserisci il dispositivo">
                        Step 2: Inserisci il dispositivo
                    </Stepper.Step>
                    <Stepper.Step label="Terzo step" description="Inserisci i dettagli della riparazione">
                        Step 3: Inserisci i dettagli della riparazione
                    </Stepper.Step>
                </Stepper>
            </Paper>
            <ScrollArea>
                <Stack gap={16}>
                    <Paper radius={12} p="md" style={{ position: 'relative' }}>
                        <FormCliente onSuccess={handleClienteSuccess} />
                    </Paper>
                    <Paper radius={12} p="md" style={{ position: 'relative' }}>
                        <FormDispositivo onSuccess={handleProductSuccess} />
                    </Paper>
                    <Paper radius={12} p="md" style={{ position: 'relative' }}>
                        <FormRiparazione />
                    </Paper>
                </Stack>
            </ScrollArea>
        </Stack>
    </div>
}
