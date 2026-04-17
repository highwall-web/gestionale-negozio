import { Stack } from '@mantine/core'
import BrandSection from '../components/dispositivi/BrandSection'
import ColorSection from '../components/dispositivi/ColorSection'
import ModelSection from '../components/dispositivi/ModelSection'

export default function GestioneDispositivi() {
    return (
        <Stack gap="md">
            <BrandSection />
            <ModelSection />
            <ColorSection />
        </Stack>
    )
}
