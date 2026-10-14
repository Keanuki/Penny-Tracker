import { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import {
    ShieldCheck,
    WalletMinimal,
    ChevronDown,
} from 'lucide-react';

export default function Welcome({ auth }) {

    const sectionRefs = useRef([]);

useEffect(() => {
    const sections = sectionRefs.current.filter(Boolean);

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        },
        {
            threshold: 0.15,
        }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
}, []);
    
    const [activeOverview, setActiveOverview] = useState(0);
    useEffect(() => {
    const interval = setInterval(() => {
        setActiveOverview((current) => (current + 1) % 3);
    }, 3000);

    return () => clearInterval(interval);
}, []);

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    };

    const previews = [
        {
            title: 'Money at a glance',
            label: 'Monthly budget',
            amount: '₱5,000.00',
            spent: '₱3,000 spent',
            percentage: '60% used',
            totalExpenses: '₱3,000',
            remaining: '₱2,000',
        },
        {
            title: 'Expense breakdown',
            label: 'Total expenses',
            amount: '₱3,000.00',
            spent: '4 spending categories',
            percentage: 'This month',
            totalExpenses: '₱1,200',
            remaining: '₱800',
        },
        {
            title: 'Budget progress',
            label: 'Remaining budget',
            amount: '₱2,000.00',
            spent: '₱3,000 spent',
            percentage: '40% remaining',
            totalExpenses: '₱5,000',
            remaining: '40%',
        },
    ];

    const currentPreview = previews[activeOverview];

    return (
        <>
            <Head title="PennyTrack | Manage Your Money" />

            <div className="min-h-screen scroll-smooth bg-white text-gray-900">
                {/* Navigation */}
                <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
                    <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                        <button
                                onClick={() => {
                                    window.scrollTo({
                                        top: 0,
                                        behavior: 'smooth',
                                    });
                                }}
                                className="inline-flex items-center gap-2 text-3xl font-black tracking-tight"
                            >
                            <WalletMinimal
                                className="h-8 w-8 text-gray-900"
                                strokeWidth={2.5}
                            />
                            <span>
                                Penny<span className="text-gray-400">Track</span>
                            </span>
                        </button>

                        <div className="hidden items-center gap-8 md:flex">
                            {['Home', 'Features', 'About'].map((item) => (
                                <button
                                    key={item}
                                    onClick={() =>
                                        scrollToSection(item.toLowerCase())
                                    }
                                    className="text-lg font-medium text-gray-600 transition hover:text-black"
                                >
                                    {item}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-3">
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 sm:inline-block"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                <main>
                    {/* Home */}
                    <section
                            id="home"
                            ref={(element) => (sectionRefs.current[0] = element)}
                            className="section-reveal border-b border-gray-100"
                        >
                        <div className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-16 md:grid-cols-2 md:py-20">
                            <div>
                                <span className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-gray-600">
                                    Your personal finance tracker
                                </span>

                                <h1 className="mt-7 text-5xl font-black leading-tight tracking-tight sm:text-6xl">
                                    Spend smarter.
                                    <br />
                                    <span className="text-gray-400">
                                        Live better.
                                    </span>
                                </h1>

                                <p className="mt-6 max-w-lg text-lg leading-8 text-gray-500">
                                    Take control of your money with a simple
                                    way to track expenses, manage your budget,
                                    and understand your spending habits.
                                </p>

                                <div className="mt-9 flex flex-wrap items-center gap-4">
                                    <Link
                                        href={auth?.user ? '/dashboard' : '/register'}
                                        className="rounded-xl bg-gray-900 px-7 py-4 font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-gray-700"
                                    >
                                        Start Tracking
                                    </Link>

                                    <button
                                        onClick={() => scrollToSection('features')}
                                        className="rounded-xl border border-gray-300 px-7 py-4 font-semibold transition hover:bg-gray-50"
                                    >
                                        Explore Features
                                    </button>
                                </div>

                                <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-gray-500">
                                    {[
                                        'Easy expense tracking',
                                        'Simple budgeting',
                                        'Clear summaries',
                                    ].map((item) => (
                                        <span
                                            key={item}
                                            className="inline-flex items-center gap-2"
                                        >
                                            <ShieldCheck className="h-6 w-6 shrink-0" />
                                            {item}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Interactive Dashboard Preview */}
                            <div className="h-[540px] rounded-3xl border border-gray-200 bg-gray-50 p-5 shadow-xl shadow-gray-200/50 sm:h-[540px] sm:p-8">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <p className="text-sm text-gray-500">
                                            Your overview
                                        </p>
                                        <h2 className="mt-1 text-xl font-bold">
                                            {currentPreview.title}
                                        </h2>
                                    </div>

                                    {/* Clickable Dots */}
                                    <div className="flex shrink-0 gap-2">
                                        {previews.map((preview, index) => (
                                            <button
                                                key={preview.title}
                                                type="button"
                                                onClick={() =>
                                                    setActiveOverview(index)
                                                }
                                                aria-label={`Show ${preview.title}`}
                                                aria-pressed={
                                                    activeOverview === index
                                                }
                                                className={`h-2.5 rounded-full transition-all duration-300 ${
                                                    activeOverview === index
                                                        ? 'w-6 bg-gray-900'
                                                        : 'w-2.5 bg-gray-300 hover:bg-gray-500'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Animated Preview Content */}
                                <div
                                    key={activeOverview}
                                    className="overview-slide mt-7 h-[390px] overflow-y-auto"
                                >
                                    {activeOverview === 0 && (
                                        <>
                                            <div className="rounded-2xl bg-gray-900 p-6 text-white">
                                                <p className="text-sm text-gray-300">
                                                    Monthly budget
                                                </p>
                                                <p className="mt-2 text-4xl font-bold">
                                                    ₱5,000.00
                                                </p>
                                                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
                                                    <div className="h-full w-3/5 rounded-full bg-white" />
                                                </div>
                                                <div className="mt-3 flex justify-between text-xs text-gray-300">
                                                    <span>₱3,000 spent</span>
                                                    <span>60% used</span>
                                                </div>
                                            </div>

                                            <div className="mt-4 grid grid-cols-2 gap-4">
                                                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                                                    <p className="text-sm text-gray-500">
                                                        Total expenses
                                                    </p>
                                                    <p className="mt-3 text-2xl font-bold">
                                                        ₱3,000
                                                    </p>
                                                    <p className="mt-2 text-xs text-gray-400">
                                                        This month
                                                    </p>
                                                </div>
                                                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                                                    <p className="text-sm text-gray-500">
                                                        Remaining
                                                    </p>
                                                    <p className="mt-3 text-2xl font-bold">
                                                        ₱2,000
                                                    </p>
                                                    <p className="mt-2 text-xs text-gray-400">
                                                        Available budget
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {activeOverview === 1 && (
                                        <div className="rounded-2xl border border-gray-200 bg-white p-6">
                                            <p className="text-sm text-gray-500">
                                                Spending by category
                                            </p>

                                            <div className="mt-6 space-y-5">
                                                {[
                                                    {
                                                        name: 'Food',
                                                        amount: '₱1,200',
                                                        width: '60%',
                                                    },
                                                    {
                                                        name: 'Transportation',
                                                        amount: '₱800',
                                                        width: '40%',
                                                    },
                                                    {
                                                        name: 'School',
                                                        amount: '₱600',
                                                        width: '30%',
                                                    },
                                                    {
                                                        name: 'Other',
                                                        amount: '₱400',
                                                        width: '20%',
                                                    },
                                                ].map((item) => (
                                                    <div key={item.name}>
                                                        <div className="mb-2 flex justify-between gap-3 text-sm">
                                                            <span className="text-gray-600">
                                                                {item.name}
                                                            </span>
                                                            <span className="font-semibold">
                                                                {item.amount}
                                                            </span>
                                                        </div>
                                                        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                                            <div
                                                                style={{
                                                                    width: item.width,
                                                                }}
                                                                className="h-full rounded-full bg-gray-800 transition-all duration-500"
                                                            />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-6 rounded-xl bg-gray-50 p-4">
                                                <p className="text-sm text-gray-500">
                                                    Total recorded expenses
                                                </p>
                                                <p className="mt-1 text-2xl font-bold">
                                                    ₱3,000
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {activeOverview === 2 && (
                                        <div className="rounded-2xl border border-gray-200 bg-white p-6">
                                            <p className="text-sm text-gray-500">
                                                Budget status
                                            </p>
                                            <p className="mt-4 text-3xl font-bold">
                                                ₱2,000.00
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Left from your monthly budget
                                            </p>

                                            <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-100">
                                                <div className="h-full w-3/5 rounded-full bg-gray-800 transition-all duration-500" />
                                            </div>

                                            <div className="mt-3 flex justify-between text-sm">
                                                <span className="text-gray-500">
                                                    60% used
                                                </span>
                                                <span className="font-semibold text-gray-800">
                                                    40% remaining
                                                </span>
                                            </div>

                                            <div className="mt-6 rounded-xl bg-gray-50 p-4">
                                                <p className="font-semibold">
                                                    Keep it balanced.
                                                </p>
                                                <p className="mt-1 text-sm leading-6 text-gray-500">
                                                    Track your spending to stay
                                                    within your monthly limit.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <p className="mt-4 text-center text-xs text-gray-400">
                                    Example preview · Not actual account data
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Features */}
                    <section
                        id="features"
                        ref={(element) => (sectionRefs.current[1] = element)}
                        className="section-reveal scroll-mt-20 bg-gray-50 py-24 sm:py-28"
                    >
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="mx-auto max-w-2xl text-center">
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                                    Features
                                </p>
                                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                                    Everything you need to manage your money.
                                </h2>
                                <p className="mt-5 leading-7 text-gray-500">
                                    Simple tools to help you make better
                                    decisions about your everyday spending.
                                </p>
                            </div>

                            <div className="mt-14 grid gap-6 md:grid-cols-3">
                                {[
                                    {
                                        number: '01',
                                        title: 'Expense Tracking',
                                        description:
                                            'Record your expenses, organize them by category, and review your transaction history.',
                                    },
                                    {
                                        number: '02',
                                        title: 'Budget Management',
                                        description:
                                            'Set a monthly spending limit and see how much of your budget remains.',
                                    },
                                    {
                                        number: '03',
                                        title: 'Spending Insights',
                                        description:
                                            'Understand where your money goes with spending summaries and category breakdowns.',
                                    },
                                ].map((feature) => (
                                    <article
                                        key={feature.number}
                                        className="group rounded-2xl border border-gray-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-gray-200/60"
                                    >
                                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-sm font-bold text-white transition group-hover:bg-gray-700">
                                            {feature.number}
                                        </span>
                                        <h3 className="mt-7 text-xl font-bold">
                                            {feature.title}
                                        </h3>
                                        <p className="mt-3 leading-7 text-gray-500">
                                            {feature.description}
                                        </p>
                                    </article>
                                ))}
                            </div>

                            <div className="mt-12 text-center">
                                <button
                                    onClick={() => scrollToSection('about')}
                                    className="inline-flex items-center gap-2 font-semibold text-gray-700 underline decoration-gray-300 underline-offset-8 transition hover:text-black"
                                >
                                    Learn more about PennyTrack
                                    <ChevronDown className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* About */}
                    <section
                            id="about"
                            ref={(element) => (sectionRefs.current[2] = element)}
                            className="section-reveal scroll-mt-20 border-t border-gray-100 py-24 sm:py-28"
                        >
                        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-500">
                                    About PennyTrack
                                </p>
                                <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
                                    Small steps toward better money habits.
                                </h2>
                            </div>

                            <div>
                                <p className="text-lg leading-8 text-gray-500">
                                    PennyTrack is designed to make personal
                                    finance easier to understand. By keeping
                                    expenses organized and budgets visible,
                                    users can become more aware of their
                                    spending and plan their money more
                                    responsibly.
                                </p>
                                <p className="mt-5 leading-7 text-gray-500">
                                    Whether you are a student managing a
                                    limited allowance or someone working
                                    toward a savings goal, PennyTrack helps
                                    make every peso count.
                                </p>

                                <Link
                                    href={auth?.user ? '/dashboard' : '/register'}
                                    className="mt-8 inline-flex rounded-xl bg-gray-900 px-6 py-3.5 font-semibold text-white transition hover:bg-gray-700"
                                >
                                    {auth?.user ? 'Open Dashboard' : 'Get Started'}
                                </Link>
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-gray-50">
                    <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-bold text-gray-900">
                            PennyTrack<span className="text-gray-400">.</span>
                        </p>
                        <p>Track your spending. Make every peso count.</p>
                        <p>© {new Date().getFullYear()} Rence Gubalane</p>
                    </div>
                </footer>
            </div>
        </>
    );
}
