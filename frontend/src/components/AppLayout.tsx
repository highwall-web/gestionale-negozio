import { Accordion, AppShell, Burger, Group, NavLink, Stack, Switch, Text } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'

import { IconCalendar, IconDeviceDesktopSearch, IconDeviceMobilePlus, IconHome, IconLogout, IconMoon, IconSun, IconUser } from '@tabler/icons-react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { ROUTES } from '../routes'
import { checkActivePath } from '../utils/urlUtils'
import { Role } from '../api'
import { Suspense } from 'react'
import { fallback } from './PageFallback'

export default function AppLayout() {
    const [opened, { toggle: toggleNav }] = useDisclosure()
    const handleNav = () => { if (!isDesktop) toggleNav() }
    const navigate = useNavigate()
    const location = useLocation()
    const { authLogout } = useAuth()
    const { isDark, toggle } = useTheme()
    const { isInRole } = useAuth()
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
                <Group h="100%" px="md" justify="space-between">
                    <Burger opened={opened} onClick={toggleNav} size="sm" />
                    <NavLink
                        label="Logout"
                        onClick={authLogout}
                        leftSection={<IconLogout size={18} stroke={1.5} />}
                        style={{ borderRadius: 'var(--mantine-radius-sm)', width: 'auto' }}
                    />
                </Group>
            </AppShell.Header>

            <AppShell.Navbar p="md">
                <Stack justify="space-between" h="100%">
                    <Stack gap={4}>
                        <Group justify='end' mb={"xs"}>
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
                            onClick={() => { navigate(ROUTES.HOME); handleNav() }}
                            variant='light'
                            active={checkActivePath(location.pathname, ROUTES.HOME)}
                            leftSection={<IconHome size={18} stroke={1.5} />}
                            style={{ borderRadius: 'var(--mantine-radius-sm)' }}
                        />
                        <NavLink
                            label="Accettazione"
                            onClick={() => { navigate(ROUTES.ACCETTAZIONE); handleNav() }}
                            variant='light'
                            active={checkActivePath(location.pathname, ROUTES.ACCETTAZIONE)}
                            leftSection={<IconDeviceMobilePlus size={18} stroke={1.5} />}
                            style={{ borderRadius: 'var(--mantine-radius-sm)' }}
                        />
                        <NavLink
                            label="Calendario"
                            onClick={() => { navigate(ROUTES.CALENDARIO); handleNav() }}
                            variant='light'
                            active={checkActivePath(location.pathname, ROUTES.CALENDARIO)}
                            leftSection={<IconCalendar size={18} stroke={1.5} />}
                            style={{ borderRadius: 'var(--mantine-radius-sm)' }}
                        />
                        <Accordion
                            variant="filled"
                            radius="md"
                            chevronPosition="right"
                            styles={{ item: { backgroundColor: 'transparent' }, label: { padding: '4px 0' }, control: { color: 'var(--mantine-color-text)', padding: "8px 12px" } }}
                        >
                            <Accordion.Item value={"gestione"}>
                                <Accordion.Control icon={<IconDeviceDesktopSearch size={18} stroke={1.5} />}>
                                    <Text size="sm">Gestione</Text>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Stack gap={2}>
                                        <NavLink
                                            label="Riparazioni"
                                            onClick={() => { navigate(ROUTES.GESTIONE_RIPARAZIONI); handleNav() }}
                                            active={checkActivePath(location.pathname, ROUTES.GESTIONE_RIPARAZIONI)}
                                            style={{ borderRadius: 'var(--mantine-radius-sm)' }}
                                        />
                                        <NavLink
                                            label="Clienti"
                                            onClick={() => { navigate(ROUTES.GESTIONE_CLIENTI); handleNav() }}
                                            active={checkActivePath(location.pathname, ROUTES.GESTIONE_CLIENTI)}
                                            style={{ borderRadius: 'var(--mantine-radius-sm)' }}
                                        />
                                        <NavLink
                                            label="Dispositivi"
                                            onClick={() => { navigate(ROUTES.GESTIONE_DISPOSITIVI); handleNav() }}
                                            active={checkActivePath(location.pathname, ROUTES.GESTIONE_DISPOSITIVI)}
                                            style={{ borderRadius: 'var(--mantine-radius-sm)' }}
                                        />
                                        <NavLink
                                            label="Interventi"
                                            onClick={() => { navigate(ROUTES.GESTIONE_INTERVENTI); handleNav() }}
                                            active={checkActivePath(location.pathname, ROUTES.GESTIONE_INTERVENTI)}
                                            style={{ borderRadius: 'var(--mantine-radius-sm)' }}
                                        />
                                    </Stack>
                                </Accordion.Panel>
                            </Accordion.Item>
                            <Accordion.Item value="utenti">
                                <Accordion.Control icon={<IconUser size={18} stroke={1.5} />}>
                                    <Text size="sm">Utenti</Text>
                                </Accordion.Control>
                                <Accordion.Panel>
                                    <Stack gap={2}>
                                        {isInRole(Role.ADMIN) && (
                                            <NavLink
                                                label="Crea utente"
                                                onClick={() => { navigate(ROUTES.CREA_UTENTE); handleNav() }}
                                                active={checkActivePath(location.pathname, ROUTES.CREA_UTENTE)}
                                                style={{ borderRadius: 'var(--mantine-radius-sm)' }}
                                            />
                                        )}
                                        <NavLink
                                            label="Modifica dati utente"
                                            onClick={() => { navigate(ROUTES.MODIFICA_UTENTE); handleNav() }}
                                            active={checkActivePath(location.pathname, ROUTES.MODIFICA_UTENTE)}
                                            style={{ borderRadius: 'var(--mantine-radius-sm)' }}
                                        />
                                    </Stack>
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
                    </Stack>
                    {isDesktop && (
                        <NavLink
                            label="Logout"
                            onClick={authLogout}
                            leftSection={<IconLogout size={18} stroke={1.5} />}
                            style={{ borderRadius: 'var(--mantine-radius-sm)' }}
                        />
                    )}
                </Stack>
            </AppShell.Navbar>

            <AppShell.Main>
                <Suspense key={location.pathname} fallback={fallback}>
                    <Outlet />
                </Suspense>
            </AppShell.Main>
        </AppShell>
    )
}
