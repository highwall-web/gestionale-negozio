import { createContext, useContext, useState } from "react";
import { useGetAllBrands, useGetAllColors, useGetInterventiGenerali, useGetInterventionsByModel, type BrandResponse, type ColorResponse, type CreateProductRequest, type CreateRepairDetailsRequest, type CustomerResponse, type InterventionResponse, type ModelResponse } from "../api";

interface isEditingType {
    editingCliente: boolean
    editingDispositivo: boolean
    editingDettagli: boolean
}

interface AccettazioneContextValue {
    brands: BrandResponse[];
    colors: ColorResponse[];
    interventiGenerali: InterventionResponse[];
    interventiGeneraliLoading: boolean;
    interventiPerModello: InterventionResponse[];
    interventiPerModelloLoading: boolean;
    brandsLoading: boolean;
    colorsLoading: boolean;
    active: number;
    updateActive: (page: number) => void;
    isEditing: isEditingType,
    toggleEditingCliente: () => void,
    toggleEditingDispositivo: () => void,
    toggleEditingDettagli: () => void,
    selectedCliente: CustomerResponse | null,
    setSelectedCliente: (c: CustomerResponse | null) => void,
    selectedDispositivo: CreateProductRequest | null,
    setSelectedDispositivo: (d: CreateProductRequest | null) => void,
    selectedDettagli: CreateRepairDetailsRequest | null,
    setSelectedDettagli: (d: CreateRepairDetailsRequest | null) => void,
    selectedModel: ModelResponse | null,
    setSelectedModel: (m: ModelResponse | null) => void,
}



const AccettazioneContext = createContext<AccettazioneContextValue | null>(null);

export function AccettazioneProvider({ children }: { children: React.ReactNode }) {
    const [active, setActive] = useState(0);
    const { data: brands = [], isLoading: brandsLoading } = useGetAllBrands();
    const { data: colors = [], isLoading: colorsLoading } = useGetAllColors();
    const { data: interventiGenerali = [], isLoading: interventiGeneraliLoading } = useGetInterventiGenerali();
    const [selectedCliente, setSelectedCliente] = useState<CustomerResponse | null>(null)
    const [selectedDispositivo, setSelectedDispositivo] = useState<CreateProductRequest | null>(null)
    const [selectedDettagli, setSelectedDettagli] = useState<CreateRepairDetailsRequest | null>(null)
    const [selectedModel, setSelectedModel] = useState<ModelResponse | null>(null)
    const { data: interventiPerModello = [], isLoading: interventiPerModelloLoading } = useGetInterventionsByModel(
        selectedModel?.id ?? 0,
        { query: { enabled: !!selectedModel?.id } }
    )

    const [isEditing, setIsEditing] = useState<isEditingType>({
        editingCliente: false,
        editingDispositivo: false,
        editingDettagli: false
    })

    function toggleEditingCliente() {
        setIsEditing(
            {
                editingCliente: !isEditing.editingCliente,
                editingDispositivo: false,
                editingDettagli: false
            }
        )
    }

    function toggleEditingDispositivo() {
        setIsEditing(
            {
                editingCliente: false,
                editingDispositivo: !isEditing.editingDispositivo,
                editingDettagli: false
            }
        )
    }

    function toggleEditingDettagli() {
        setIsEditing(
            {
                editingCliente: false,
                editingDispositivo: false,
                editingDettagli: !isEditing.editingDettagli
            }
        )
    }

    function updateActive(page: number) {
        setActive(page);
    }

    return (
        <AccettazioneContext.Provider value={{
            brands,
            colors,
            interventiGenerali,
            brandsLoading,
            colorsLoading,
            interventiGeneraliLoading,
            active,
            updateActive,
            isEditing,
            toggleEditingCliente,
            toggleEditingDispositivo,
            toggleEditingDettagli,
            selectedCliente,
            setSelectedCliente,
            selectedDispositivo,
            setSelectedDispositivo,
            selectedDettagli,
            setSelectedDettagli,
            selectedModel,
            setSelectedModel,
            interventiPerModello,
            interventiPerModelloLoading
        }}>
            {children}
        </AccettazioneContext.Provider>
    );
}

export function useAccettazione() {
    const ctx = useContext(AccettazioneContext);
    if (!ctx) throw new Error("useAccettazione must be used within AccettazioneProvider");
    return ctx;
}
