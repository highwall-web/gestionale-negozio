import { Paper, Stack, Stepper } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { getGetAllBrandsQueryKey, getGetAllColorsQueryKey, getGetModelsByBrandIdQueryKey, useCreateColor, useCreateModel, type CreateProductRequest, type CreateRepairDetailsRequest, type CustomerResponse } from "../api";
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
        selectedDispositivo,
        setSelectedDettagli,
        setSelectedModel,
        selectedModel
    } = useAccettazione();
    const queryClient = useQueryClient();
    const { mutate: createModel } = useCreateModel();
    const { mutate: createColor } = useCreateColor();

    const handleClienteSuccess = (customer: CustomerResponse) => {
        setSelectedCliente(customer)
        updateActive(active + 1)
    }

    const handleProductSuccess = (product: CreateProductRequest, brandId?: number | null) => {
        setSelectedDispositivo(product)
        const unchanged = selectedModel
            && product.model.brandNome === selectedDispositivo?.model.brandNome
            && product.model.nome === selectedDispositivo?.model.nome
            && product.color.nome === selectedDispositivo?.color.nome
        if (unchanged) {
            updateActive(active + 1)
            return
        }
        createModel({
            data: {
                brandNome: product.model.brandNome,
                nome: product.model.nome,
                tipoDispositivo: product.model.tipoDispositivo
            }
        }, {
            onSuccess: (model) => {
                setSelectedModel(model)
                createColor({
                    data: { nome: product.color.nome }
                }, {
                    onSuccess: () => {
                        queryClient.invalidateQueries({ queryKey: getGetAllColorsQueryKey() })
                        queryClient.invalidateQueries({ queryKey: getGetAllBrandsQueryKey() })
                        if (brandId) {
                            queryClient.invalidateQueries({ queryKey: getGetModelsByBrandIdQueryKey(brandId) })
                        }
                        updateActive(active + 1)
                    },
                    onError: () => toast.error("Qualcosa è andato storto, riprova")
                })
            },
            onError: () => toast.error("Qualcosa è andato storto, riprova")
        })
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
