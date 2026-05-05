export const cookieConfig = {
    secure: process.env.COOKIE_SECURE === "true",
    sameSite: (process.env.COOKIE_SAME_SITE ?? "strict") as "strict" | "lax" | "none",
    rememberMeDays: parseInt(process.env.COOKIE_REMEMBER_ME_DAYS ?? "30"),
    defaultDays: parseInt(process.env.COOKIE_DEFAULT_DAYS ?? "1"),
};
