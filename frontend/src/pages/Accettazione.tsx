import { Overlay, Paper, ScrollArea, Stack, Stepper } from "@mantine/core";
import { useState } from "react";
import type { CustomerResponse } from "../api";
import FormCliente from "../components/accettazione/FormCliente";
import FormDispositivo from "../components/accettazione/FormDispositivo";
import FormRiparazione from "../components/accettazione/FormRiparazione";

export default function Accettazione() {

    const [active, setActive] = useState(0);
    const [customerId, setCustomerId] = useState<number | null>(null);

    const handleClienteSuccess = (customer: CustomerResponse) => {
        setCustomerId(customer.id!)
        setActive(1)
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
                    <Stepper.Step label="Terzo step" description="Inserisci i dettali della riparazione">
                        Step 3: Inserisci i dettali della riparazione
                    </Stepper.Step>
                </Stepper>
            </Paper>
            <ScrollArea>
                <Stack gap={16}>
                    <Paper radius={12} p="md" style={{ position: 'relative' }}>
                        <FormCliente onSuccess={handleClienteSuccess} active={active} />
                    </Paper>
                    <Paper radius={12} p="md" style={{ position: 'relative' }}>
                        {active !== 1 && <Overlay radius={12} backgroundOpacity={0.35} zIndex={1} />}
                        <FormDispositivo />
                    </Paper>
                    <Paper radius={12} p="md" style={{ position: 'relative' }}>
                        {active !== 2 && <Overlay radius={12} backgroundOpacity={0.35} zIndex={1} />}
                        <FormRiparazione />
                    </Paper>
                </Stack>
            </ScrollArea>
        </Stack>
    </div>
}
