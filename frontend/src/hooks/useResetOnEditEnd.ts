import { useEffect, useRef } from 'react'

export function useResetOnEditEnd(isEditing: boolean, onEditEnd: () => void) {
    const wasEditingRef = useRef(false)

    useEffect(() => {
        if (wasEditingRef.current && !isEditing) {
            onEditEnd()
        }
        wasEditingRef.current = isEditing
    }, [isEditing]) // eslint-disable-line react-hooks/exhaustive-deps
}
