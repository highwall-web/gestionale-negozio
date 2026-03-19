import { Outlet } from 'react-router-dom'
import { AppShell, ActionIcon, Burger, Group, NavLink, Stack } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconSun, IconMoon } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { ROUTES } from '../routes'

export default function AppLayout() {
    const [opened, { toggle: toggleNav }] = useDisclosure()
    const navigate = useNavigate()
    const { authLogout } = useAuth()
    const { isDark, toggle } = useTheme()
    const isDesktop = useMediaQuery('(min-width: 48em)')

    return (
        <AppShell
            header={{ height: 52, collapsed: isDesktop }}
            navbar={{ width: isDesktop ? 220 : '100%', breakpoint: 'sm', collapsed: { mobile: !opened } }}
            padding="md"
            styles={{
                root: { backgroundColor: 'light-dark(var(--mantine-color-gray-3), var(--mantine-color-dark-8))' },
                navbar: {
                    margin: isDesktop ? '12px' : '0',
                    height: isDesktop ? 'calc(100vh - 24px)' : '100%',
                    borderRadius: isDesktop ? '12px' : '0',
                    border: 'none',
                    backgroundColor: 'light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))',
                },
                main: {
                    backgroundColor: 'transparent',
                },
            }}
        >
            <AppShell.Header>
                <Group h="100%" px="md">
                    <Burger opened={opened} onClick={toggleNav} size="sm" />
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <Stack justify="space-between" h="100%">
                    <Stack gap={4}>
                        <NavLink label="Home" onClick={() => { navigate(ROUTES.HOME); toggleNav() }} />
                    </Stack>
                    <NavLink label="Logout" onClick={authLogout} />
                </Stack>
            </AppShell.Navbar>

            <AppShell.Main>
                <Outlet />
                <ActionIcon
                    variant="default"
                    size="lg"
                    radius="xl"
                    onClick={toggle}
                    style={{ position: 'fixed', bottom: 12, right: 12 }}
                >
                    {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
                </ActionIcon>
            </AppShell.Main>
        </AppShell>
    )
}
