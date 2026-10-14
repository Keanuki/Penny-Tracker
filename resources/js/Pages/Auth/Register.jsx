import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import { CircleDollarSign } from 'lucide-react';
import { CircleArrowLeft } from 'lucide-react';
import { WalletMinimal } from 'lucide-react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Create Account | PennyTrack" />

            <main className="min-h-screen bg-gray-50 text-gray-900">
                <div className="grid min-h-screen lg:grid-cols-2">

                    {/* Left side: PennyTrack branding */}
                    <section className="relative hidden flex-col justify-between overflow-hidden bg-gray-900 p-12 text-white lg:flex xl:p-16">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-2xl font-black tracking-tight"
                        >
                            <WalletMinimal className="h-8 w-8" />
                            <span>
                                Penny<span className="text-gray-400">Track</span>
                            </span>
                        </Link>
                        <div className="relative z-10 max-w-lg">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-400">
                                Start your journey
                            </p>

                            <h1 className="mt-5 text-5xl font-black leading-tight xl:text-6xl">
                                Build better<br />
                                money habits.<br />
                                <span className="text-gray-400">One step at a time.</span>
                            </h1>

                            <p className="mt-6 max-w-md text-lg leading-8 text-gray-300">
                                Create your account to organize your expenses,
                                plan your budget, and take control of your money.
                            </p>

                            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
                                <p className="text-sm text-gray-400">Your goal</p>
                                <p className="mt-2 text-xl font-semibold">
                                    Spend wisely. Save consistently. Grow confidently.
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-500">
                            © {new Date().getFullYear()} PennyTrack
                        </p>

                        <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full border border-white/10" />
                        <div className="pointer-events-none absolute -bottom-20 -right-8 h-72 w-72 rounded-full border border-white/10" />
                    </section>

                    {/* Right side: Registration form */}
                    <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-12">
                        <div className="w-full max-w-md">

                            <Link href="/" className="inline-flex text-xl font-black tracking-tight lg:hidden">
                                Penny<span className="text-gray-400">Track.</span>
                            </Link>

                            <div className="mb-8 mt-10 lg:mt-0">
                                <Link
                                    href="/"
                                    className="text-sm font-medium text-gray-500 transition hover:text-gray-900"
                                >
                                    <CircleArrowLeft />
                                </Link>

                                <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                                    Your personal finance tracker
                                </p>

                                <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                                    Create your account.
                                </h2>

                                <p className="mt-3 text-gray-500">
                                    Join PennyTrack and start managing your money.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label htmlFor="name" className="mb-2 block text-sm font-semibold text-gray-700">
                                        Full name
                                    </label>

                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        autoComplete="name"
                                        autoFocus
                                        required
                                        placeholder="Enter your full name"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                                    />

                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <label htmlFor="email" className="mb-2 block text-sm font-semibold text-gray-700">
                                        Email address
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        autoComplete="username"
                                        required
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                                    />

                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <label htmlFor="password" className="mb-2 block text-sm font-semibold text-gray-700">
                                        Password
                                    </label>

                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        autoComplete="new-password"
                                        required
                                        placeholder="Create a password"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                                    />

                                    <InputError message={errors.password} className="mt-2" />
                                </div>

                                <div>
                                    <label htmlFor="password_confirmation" className="mb-2 block text-sm font-semibold text-gray-700">
                                        Confirm password
                                    </label>

                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        autoComplete="new-password"
                                        required
                                        placeholder="Enter your password again"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                                    />

                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-xl bg-gray-900 px-5 py-4 font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? 'Creating account...' : 'Sign up'}
                                </button>
                            </form>

                            <div className="my-8 flex items-center gap-4">
                                <div className="h-px flex-1 bg-gray-200" />
                                <span className="text-xs uppercase tracking-wider text-gray-400">
                                    Already a member?
                                </span>
                                <div className="h-px flex-1 bg-gray-200" />
                            </div>

                            <p className="text-center text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link
                                    href={route('login')}
                                    className="font-bold text-gray-900 underline underline-offset-4 transition hover:text-gray-500"
                                >
                                    Log in
                                </Link>
                            </p>

                            <p className="mt-10 text-center text-xs leading-5 text-gray-400">
                                Manage your spending. Plan your budget. Make every peso count.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
