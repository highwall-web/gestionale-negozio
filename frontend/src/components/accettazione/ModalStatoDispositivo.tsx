import { Button, Divider, Group, Modal, Stack, Switch, Text } from "@mantine/core";
import { useState } from "react";

interface ModalStatoDispositivoProps {
    opened: boolean;
    onClose: () => void;
    onConferma: (stato: {
        lasciatoInNegozio: boolean;
        contattoConLiquidi: boolean;
        dispositivoNonTestabile: boolean;
        acquistatoPressoDiNoi: boolean;
    }) => void;
    isPending: boolean;
}

export default function ModalStatoDispositivo({ opened, onClose, onConferma, isPending }: ModalStatoDispositivoProps) {
    const [lasciatoInNegozio, setLasciatoInNegozio] = useState(false);
    const [contattoConLiquidi, setContattoConLiquidi] = useState(false);
    const [dispositivoNonTestabile, setDispositivoNonTestabile] = useState(false);
    const [acquistatoPressoDiNoi, setAcquistatoPressoDiNoi] = useState(false);

    function handleConferma() {
        onConferma({ lasciatoInNegozio, contattoConLiquidi, dispositivoNonTestabile, acquistatoPressoDiNoi });
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Stato del dispositivo"
        >
            <Stack gap="md">
                <Text size="sm" c="dimmed">
                    Indica le condizioni del dispositivo prima di creare la riparazione.
                </Text>
                <Divider />
                <Switch
                    label="Lasciato in negozio"
                    checked={lasciatoInNegozio}
                    onChange={(e) => setLasciatoInNegozio(e.currentTarget.checked)}
                />
                <Switch
                    label="Contatto con liquidi"
                    checked={contattoConLiquidi}
                    onChange={(e) => setContattoConLiquidi(e.currentTarget.checked)}
                />
                <Switch
                    label="Dispositivo non testabile"
                    checked={dispositivoNonTestabile}
                    onChange={(e) => setDispositivoNonTestabile(e.currentTarget.checked)}
                />
                <Switch
                    label="Acquistato presso di noi"
                    checked={acquistatoPressoDiNoi}
                    onChange={(e) => setAcquistatoPressoDiNoi(e.currentTarget.checked)}
                />
                <Divider />
                <Group justify="flex-end">
                    <Button.Group>
                        <Button variant="default" onClick={onClose} radius={"sm"}>Annulla</Button>
                        <Button onClick={handleConferma} loading={isPending} radius={"sm"}>
                            Conferma e crea
                        </Button>
                    </Button.Group>
                </Group>
            </Stack>
        </Modal>
    );
}
