import { Button, Group } from "@mantine/core";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCreateRepair } from "../../api";
import { useAccettazione } from "../../context/AccettazioneContext";
import { ROUTES } from "../../routes";

export default function FormConferma() {
    const { selectedCliente, selectedClienteId, selectedDispositivo, selectedDettagli, active } = useAccettazione();
    const navigate = useNavigate();

    const { mutate: createRepair, isPending } = useCreateRepair();

    function handleConferma() {
        if (!selectedCliente || !selectedDispositivo || !selectedDettagli) {
            toast.error("Verifica i dati e riprova")
            return;
        }

        createRepair({
            data: {
                customerId: selectedClienteId ?? undefined,
                customer: selectedCliente,
                product: selectedDispositivo,
                details: selectedDettagli,
            }
        }, {
            onSuccess: () => {
                toast.success("Accettazione completata");
                navigate(ROUTES.HOME);
            },
            onError: () => toast.error("Errore durante l'accettazione"),
        });
    }

    return (
        <>
            <Group justify="flex-end">
                <Button onClick={handleConferma} loading={isPending} disabled={active !== 4}>
                    Crea la riparazione
                </Button>
            </Group>
        </>
    )
}
