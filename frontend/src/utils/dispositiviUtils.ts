export const CAPACITA_OPTIONS = Array.from({ length: 9 }, (_, i) => {
    const gb = 8 * Math.pow(2, i)
    const label = gb >= 1024 ? `${gb / 1024}TB` : `${gb}GB`
    return { value: label, label }
})
