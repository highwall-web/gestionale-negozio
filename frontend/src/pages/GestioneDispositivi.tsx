import { Grid } from '@mantine/core'
import BrandSection from '../components/dispositivi/BrandSection'
import ColorSection from '../components/dispositivi/ColorSection'
import ModelSection from '../components/dispositivi/ModelSection'

export default function GestioneDispositivi() {
    return (
        <Grid align="flex-start">
            <Grid.Col span={{ base: 12, md: 4 }}>
                <BrandSection />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
                <ModelSection />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 4 }}>
                <ColorSection />
            </Grid.Col>
        </Grid>
    )
}
