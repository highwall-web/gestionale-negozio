let accessToken: string | null = null

export const tokenStore = {
    clear: () => accessToken = null,
    get: () => accessToken,
    set: (token: string | null) => {
        accessToken = token
    },
}
