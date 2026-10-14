import { useState, useRef, useEffect } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import {
    WalletMinimal,
    LayoutDashboard,
    Receipt,
    Wallet,
    Menu,
    X,
    House,
    LogOut,
    ChartNoAxesCombined,
} from 'lucide-react';

export default function AuthenticatedLayout({ children, header }) {
    const { auth, url } = usePage().props;
    const currentUrl = usePage().url;

    const [profileOpen, setProfileOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const profileRef = useRef(null);

    const profileColors = [
        '#7f1d1d',
        '#172554',
        '#374151',
        '#581c87',
        '#164e63',
        '#14532d',
        '#831843',
    ];

    function getProfileColor(userId) {
        const id = String(userId || 'guest');
        let hash = 0;

        for (let i = 0; i < id.length; i++) {
            hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
        }

        return profileColors[hash % profileColors.length];
    }

    const firstName =
        auth?.user?.name?.trim().split(/\s+/)[0] || 'Profile';

    const profileColor = getProfileColor(auth?.user?.id);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setProfileOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                setProfileOpen(false);
                setMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, []);

    const logout = () => {
        router.post('/logout');
    };

    const navigation = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        name: 'Expenses',
        href: '/expenses',
        icon: Receipt,
    },
    {
        name: 'Budget Settings',
        href: '/budget-settings',
        icon: Wallet,
    },
    {
        name: 'Reports & Analytics',
        href: '/reports',
        icon: ChartNoAxesCombined,
    },
];

    const navLinkClass = (href) => {
        const active =
            currentUrl === href ||
            currentUrl.startsWith(href + '/');

        return `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
            active
                ? 'bg-gray-900 text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`;
    };

    const sidebarLinks = (
        <>
            <p className="mb-3 px-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                Main Menu
            </p>

            {navigation.map((item) => {
                const Icon = item.icon;

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={navLinkClass(item.href)}
                    >
                        <Icon className="h-5 w-5 shrink-0" />
                        {item.name}
                    </Link>
                );
            })}
        </>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Head title="PennyTrack" />

            {/* Top Navigation */}
            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
                <nav className="mx-auto flex min-h-[76px] max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
                    <div className="flex min-w-0 items-center gap-3">
                        {/* Mobile menu button */}
                        <button
                            type="button"
                            onClick={() =>
                                setMobileMenuOpen((open) => !open)
                            }
                            aria-label={
                                mobileMenuOpen
                                    ? 'Close navigation menu'
                                    : 'Open navigation menu'
                            }
                            aria-expanded={mobileMenuOpen}
                            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-gray-700 hover:bg-gray-100 md:hidden"
                        >
                            {mobileMenuOpen ? (
                                <X className="h-6 w-6" />
                            ) : (
                                <Menu className="h-6 w-6" />
                            )}
                        </button>

                        {/* Brand */}
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-xl font-black tracking-tight sm:text-2xl"
                        >
                            <WalletMinimal className="h-7 w-7 shrink-0 text-gray-900 sm:h-8 sm:w-8" />
                            <span>
                                Penny
                                <span className="text-gray-400">
                                    Track
                                </span>
                            </span>
                        </Link>
                    </div>

                    <div className="flex shrink-0 items-center gap-3 sm:gap-10">
                        <Link
                            href="/"
                            className="hidden items-center gap-2 text-lg font-medium text-gray-600 hover:text-gray-900 sm:inline-flex"
                        >
                            <House className="h-6 w-6" />
                            Home
                        </Link>

                        {/* Profile dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button
                                type="button"
                                onClick={() =>
                                    setProfileOpen((open) => !open)
                                }
                                aria-label="Open profile menu"
                                aria-expanded={profileOpen}
                                className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm transition hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 sm:h-11 sm:w-11"
                                style={{
                                    backgroundColor: profileColor,
                                }}
                            >
                                {firstName.charAt(0).toUpperCase()}
                            </button>

                            {profileOpen && (
                                <div
                                    role="menu"
                                    className="absolute right-0 mt-3 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white p-2 shadow-xl shadow-gray-200/60"
                                >
                                    <div className="px-3 py-3">
                                        <p className="truncate text-sm font-bold text-gray-900">
                                            {auth?.user?.name}
                                        </p>
                                        <p className="truncate text-xs text-gray-500">
                                            {auth?.user?.email}
                                        </p>
                                    </div>

                                    <div className="my-1 border-t border-gray-100" />

                                    <button
                                        type="button"
                                        role="menuitem"
                                        onClick={logout}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                    >
                                        <svg
                                            className="h-5 w-5"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M10 17l5-5-5-5M15 12H3m9-9h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
            </header>

                <div className="mx-auto flex min-h-[calc(100vh-76px)] max-w-[1600px]">
                                {/* Desktop sidebar */}
                                
                <aside className="hidden w-64 shrink-0 flex-col border-r border-gray-200 bg-white px-4 py-8 md:flex">
                    <nav className="space-y-2">
                        {sidebarLinks}
                    </nav>

                    <div className="mt-auto pt-8">
                        <button
                            type="button"
                            onClick={logout}
                            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                        >
                            <LogOut className="h-5 w-5" />
                            Log Out
                        </button>
                </div>
                    <div className="mt-6 rounded-2xl bg-gray-50 p-4">
                        <WalletMinimal className="mb-3 h-6 w-6 text-gray-700" />
                        <p className="text-sm font-bold text-gray-900">
                            PennyTrack
                        </p>
                        <p className="mt-1 text-xs leading-5 text-gray-500">
                            Track your expenses and manage your monthly budget.
                        </p>
                    </div>
                </aside>


                {/* Mobile sidebar */}
                {mobileMenuOpen && (
                    <button
                        type="button"
                        aria-label="Close navigation menu"
                        onClick={() => setMobileMenuOpen(false)}
                        className="fixed inset-0 top-[76px] z-40 bg-black/30 md:hidden"
                    />
                )}

                <aside
                    className={`fixed bottom-0 left-0 top-[76px] z-40 w-72 max-w-[85vw] overflow-y-auto border-r border-gray-200 bg-white px-4 py-8 shadow-xl transition-transform duration-200 md:hidden ${
                        mobileMenuOpen
                            ? 'translate-x-0'
                            : '-translate-x-full'
                    }`}
                >
                    <nav className="space-y-2">
                        {sidebarLinks}
                    </nav>

                    <button
                        type="button"
                        onClick={logout}
                        className="mt-8 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                        Log Out
                    </button>
                </aside>

                {/* Main Content */}
                <div className="min-w-0 flex-1">
                    {header && (
                        <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
                            <div className="mx-auto max-w-7xl">
                                {header}
                            </div>
                        </div>
                    )}

                    <main className="min-w-0">
                        <div key={currentUrl} className="page-transition">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
