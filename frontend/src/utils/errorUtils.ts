import type { AxiosError } from 'axios'

export function getAxiosErrorMessage(error: unknown, fallback = 'Si è verificato un errore'): string {
    const axiosError = error as AxiosError<{ message?: string }>
    return axiosError?.response?.data?.message ?? axiosError?.message ?? fallback
}
