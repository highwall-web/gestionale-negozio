import { createContext, useContext, useState } from "react";
import { useGetAllBrands, useGetAllColors, type BrandResponse, type ColorResponse } from "../api";

interface AccettazioneContextValue {
    brands: BrandResponse[];
    colors: ColorResponse[];
    brandsLoading: boolean;
    colorsLoading: boolean;
    active: number;
    updateActive: (page: number) => void
}

const AccettazioneContext = createContext<AccettazioneContextValue | null>(null);

export function AccettazioneProvider({ children }: { children: React.ReactNode }) {
    const [active, setActive] = useState(0);
    const { data: brands = [], isLoading: brandsLoading } = useGetAllBrands();
    const { data: colors = [], isLoading: colorsLoading } = useGetAllColors();

    function updateActive(page: number) {
        setActive(page);
    }

    return (
        <AccettazioneContext.Provider value={{ brands, colors, brandsLoading, colorsLoading, active, updateActive }}>
            {children}
        </AccettazioneContext.Provider>
    );
}

export function useAccettazione() {
    const ctx = useContext(AccettazioneContext);
    if (!ctx) throw new Error("useAccettazione must be used within AccettazioneProvider");
    return ctx;
}
