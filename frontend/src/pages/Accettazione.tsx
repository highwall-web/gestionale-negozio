import { Paper, Stack, Stepper } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { type CreateCustomerRequest, type CreateProductRequest, type CreateRepairDetailsRequest, type RecordStringStringArray } from "../api";
import FormCliente from "../components/accettazione/FormCliente";
import FormConferma from "../components/accettazione/FormConferma";
import FormDifetti from "../components/accettazione/FormDifetti";
import FormDispositivo from "../components/accettazione/FormDispositivo";
import FormRiparazione from "../components/accettazione/FormRiparazione";
import { useAccettazione } from "../context/AccettazioneContext";

export default function Accettazione() {

    const isMobile = useMediaQuery('(max-width: 768px)')

    const {
        active,
        updateActive,
        setSelectedCliente,
        setSelectedClienteId,
        setSelectedDispositivo,
        setSelectedDettagli,
        selectedDispositivo
    } = useAccettazione();

    const handleClienteSuccess = (customer: CreateCustomerRequest, id: number | null) => {
        setSelectedCliente(customer)
        setSelectedClienteId(id)
        updateActive(active + 1)
    }

    const handleProductSuccess = (product: CreateProductRequest) => {
        setSelectedDispositivo(product)
        updateActive(active + 1)
    }

    const handleDetailsSuccess = (details: CreateRepairDetailsRequest) => {
        setSelectedDettagli(details)
        updateActive(active + 1)
    }

    const handleTestSuccess = (testDiagnostici: RecordStringStringArray) => {
        if (!selectedDispositivo) return;
        setSelectedDispositivo({
            ...selectedDispositivo,
            testDiagnostici: testDiagnostici
        })
        updateActive(active + 1)
    }

    return <Stack gap={16}>
        {!isMobile &&
            <Paper
                radius={12}
                p="md"
                ta={'start'}
                style={{ position: 'sticky', top: 16, zIndex: 100 }}
                shadow="md"
            >
                <Stepper active={active}>
                    <Stepper.Step
                        label="Primo step"
                        description="Inserisci il cliente"
                    >
                        Inserisci il cliente
                    </Stepper.Step>
                    <Stepper.Step
                        label="Secondo step"
                        description="Inserisci il dispositivo"
                    >
                        Inserisci il dispositivo
                    </Stepper.Step>
                    <Stepper.Step
                        label="Terzo step"
                        description="Inserisci i dettagli della riparazione"
                    >
                        Inserisci i dettagli della riparazione
                    </Stepper.Step>
                    <Stepper.Step
                        label="Quarto step"
                        description="Inserisci i difetti del dispositivo"
                    >
                        Inserisci i difetti del dispositivo
                    </Stepper.Step>
                    <Stepper.Completed>
                        Completa l'accettazione
                    </Stepper.Completed>
                </Stepper>
            </Paper>
        }
        <Stack gap={16}>
            <Paper
                radius={12}
                p="md"
                style={{ position: 'relative' }}
                shadow="md"
            >
                <FormCliente onSuccess={handleClienteSuccess} />
            </Paper>
            <Paper
                radius={12}
                p="md"
                style={{ position: 'relative' }}
                shadow="md"
            >
                <FormDispositivo onSuccess={handleProductSuccess} />
            </Paper>
            <Paper
                radius={12}
                p="md"
                style={{ position: 'relative' }}
                shadow="md"
            >
                <FormRiparazione onSuccess={handleDetailsSuccess} />
            </Paper>
            <Paper
                radius={12}
                p="md"
                style={{ position: 'relative' }}
                shadow="md"
            >
                <FormDifetti onSuccess={handleTestSuccess} />
            </Paper>
            <Paper
                radius={12}
                p="md"
                style={{ position: 'relative' }}
                shadow="md"
            >
                <FormConferma />
            </Paper>
        </Stack>
    </Stack>
}
