import { Paper, Stack, Stepper } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { type CreateCustomerRequest, type CreateProductRequest, type CreateRepairDetailsRequest } from "../api";
import FormCliente from "../components/accettazione/FormCliente";
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
        setSelectedDispositivo,
        setSelectedDettagli
    } = useAccettazione();

    const handleClienteSuccess = (customer: CreateCustomerRequest) => {
        setSelectedCliente(customer)
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
                    <Stepper.Step label="Primo step" description="Inserisci il cliente">
                        Step 1: Inserisci il cliente
                    </Stepper.Step>
                    <Stepper.Step label="Secondo step" description="Inserisci il dispositivo">
                        Step 2: Inserisci il dispositivo
                    </Stepper.Step>
                    <Stepper.Step label="Terzo step" description="Inserisci i dettagli della riparazione">
                        Step 3: Inserisci i dettagli della riparazione
                    </Stepper.Step>
                    <Stepper.Step label="Quarto step" description="Inserisci i difetti del dispositivo">
                        Step 4: Inserisci i difetti del dispositivo
                    </Stepper.Step>
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
                <FormDifetti />
            </Paper>
        </Stack>
    </Stack>
}
