import { Button, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useCreateRepair } from "../../api";
import { useAccettazione } from "../../context/AccettazioneContext";
import { ROUTES } from "../../routes";
import ModalStatoDispositivo from "./ModalStatoDispositivo";

export default function FormConferma() {
    const { selectedCliente, selectedClienteId, selectedDispositivo, selectedDettagli, active } = useAccettazione();
    const navigate = useNavigate();

    const { mutate: createRepair, isPending } = useCreateRepair();
    const [opened, { open, close }] = useDisclosure(false);

    function handleOpenModal() {
        if (!selectedCliente || !selectedDispositivo || !selectedDettagli) {
            toast.error("Verifica i dati e riprova")
            return;
        }
        open();
    }

    function handleConferma(stato: {
        lasciatoInNegozio: boolean;
        contattoConLiquidi: boolean;
        dispositivoNonTestabile: boolean;
        acquistatoPressoDiNoi: boolean;
    }) {
        if (!selectedCliente || !selectedDispositivo || !selectedDettagli) return;

        createRepair({
            data: {
                customerId: selectedClienteId ?? undefined,
                customer: selectedCliente,
                product: {
                    ...selectedDispositivo,
                    ...stato,
                },
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
            <ModalStatoDispositivo
                opened={opened}
                onClose={close}
                onConferma={handleConferma}
                isPending={isPending}
            />
            <Group justify="flex-end">
                <Button onClick={handleOpenModal} disabled={active !== 4}>
                    Crea la riparazione
                </Button>
            </Group>
        </>
    )
}
