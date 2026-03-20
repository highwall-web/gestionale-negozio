import { ActionIcon, AppShell, Burger, Group, NavLink, Stack, Switch } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { IconDeviceMobilePlus, IconHome, IconLogout, IconMoon, IconMoonStars, IconSun } from '@tabler/icons-react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { ROUTES } from '../routes'
import { checkActivePath } from '../utils/urlUtils'

export default function AppLayout() {
    const [opened, { toggle: toggleNav }] = useDisclosure()
    const navigate = useNavigate()
    const location = useLocation();
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
                    margin: isDesktop ? '16px' : '0',
                    height: isDesktop ? 'calc(100vh - 32px)' : '100%',
                    borderRadius: isDesktop ? '12px' : '0',
                    border: 'none',
                    backgroundColor: 'light-dark(var(--mantine-color-white), var(--mantine-color-dark-7))',
                },
                main: {
                    backgroundColor: 'transparent',
                    paddingLeft: isDesktop ? 'calc(var(--app-shell-navbar-width, 0rem) + var(--app-shell-padding) + 16px)' : undefined,
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
                        <Group justify='end'>
                            <Switch
                                checked={isDark}
                                onChange={toggle}
                                size="md"
                                color="dark.4"
                                onLabel={<IconSun size={16} stroke={2.5} color="var(--mantine-color-yellow-4)" />}
                                offLabel={<IconMoon size={16} stroke={2.5} color="var(--mantine-color-blue-6)" />}
                            />
                        </Group>
                        <NavLink
                            label="Dashboard"
                            onClick={() => { navigate(ROUTES.HOME); toggleNav() }}
                            variant='light'
                            active={checkActivePath(location.pathname, ROUTES.HOME)}
                            leftSection={<IconHome size={18} stroke={1.5} />}
                        />
                        <NavLink
                            label="Accettazione"
                            onClick={() => { navigate(ROUTES.ACCETTAZIONE); toggleNav() }}
                            variant='light'
                            active={checkActivePath(location.pathname, ROUTES.ACCETTAZIONE)}
                            leftSection={<IconDeviceMobilePlus size={18} stroke={1.5} />}
                        />
                    </Stack>
                    <NavLink
                        label="Logout"
                        onClick={authLogout}
                        leftSection={<IconLogout size={18} stroke={1.5} />}
                    />
                </Stack>
            </AppShell.Navbar>

            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    )
}
