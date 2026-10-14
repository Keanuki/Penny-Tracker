
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import { CircleArrowLeft } from 'lucide-react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in | PennyTrack" />

            <main className="min-h-screen bg-gray-50 text-gray-900">
                <div className="grid min-h-screen lg:grid-cols-2">
                    {/* Left side: Brand introduction */}
                    <section className="relative hidden flex-col justify-between overflow-hidden bg-gray-900 p-12 text-white lg:flex xl:p-16">
                        <Link
                            href="/"
                            className="text-2xl font-black tracking-tight"
                        >
                            Penny<span className="text-gray-400">Track.</span>
                        </Link>

                        <div className="relative z-10 max-w-lg">
                            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-400">
                                Welcome back
                            </p>

                            <h1 className="mt-5 text-5xl font-black leading-tight xl:text-6xl">
                                Your money.
                                <br />
                                Your goals.
                                <br />
                                <span className="text-gray-400">
                                    Your control.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-md text-lg leading-8 text-gray-300">
                                Keep your expenses organized, stay within your
                                budget, and make every peso count.
                            </p>

                            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
                                <p className="text-sm text-gray-400">
                                    A little reminder
                                </p>
                                <p className="mt-2 text-xl font-semibold">
                                    Better money habits start with small steps.
                                </p>
                            </div>
                        </div>

                        <p className="text-sm text-gray-500">
                            © {new Date().getFullYear()} PennyTrack
                        </p>

                        <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full border border-white/10" />
                        <div className="pointer-events-none absolute -bottom-20 -right-8 h-72 w-72 rounded-full border border-white/10" />
                    </section>

                    {/* Right side: Login form */}
                    <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-12">
                        <div className="w-full max-w-md">
                            <Link
                                href="/"
                                className="inline-flex text-xl font-black tracking-tight lg:hidden"
                            >
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
                                    Welcome back, bro.
                                </h2>

                                <p className="mt-3 text-gray-500">
                                    Log in to continue managing your money.
                                </p>
                            </div>

                            {status && (
                                <div
                                    role="status"
                                    className="mb-5 rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-700"
                                >
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="mb-2 block text-sm font-semibold text-gray-700"
                                    >
                                        Email address
                                    </label>

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        autoComplete="username"
                                        autoFocus
                                        required
                                        placeholder="you@example.com"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                                    />

                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center justify-between gap-3">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-semibold text-gray-700"
                                        >
                                            Password
                                        </label>

                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-sm font-medium text-gray-500 underline underline-offset-4 transition hover:text-gray-900"
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>

                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        autoComplete="current-password"
                                        required
                                        placeholder="Enter your password"
                                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                                    />

                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <label className="flex cursor-pointer items-center gap-3">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData('remember', e.target.checked)
                                        }
                                        className="h-4 w-4 rounded border-gray-300 accent-gray-900 focus:ring-gray-500"
                                    />
                                    <span className="text-sm text-gray-600">
                                        Remember me
                                    </span>
                                </label>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full rounded-xl bg-gray-900 px-5 py-4 font-semibold text-white transition hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {processing ? 'Logging in...' : 'Log in'}
                                </button>
                            </form>

                            <div className="my-8 flex items-center gap-4">
                                <div className="h-px flex-1 bg-gray-200" />
                                <span className="text-xs uppercase tracking-wider text-gray-400">
                                    New to PennyTrack?
                                </span>
                                <div className="h-px flex-1 bg-gray-200" />
                            </div>

                            <p className="text-center text-sm text-gray-600">
                                Don't have an account?{' '}
                                <Link
                                    href="/register"
                                    className="font-bold text-gray-900 underline underline-offset-4 transition hover:text-gray-500"
                                >
                                    Sign up
                                </Link>
                            </p>

                            <p className="mt-10 text-center text-xs leading-5 text-gray-400">
                                Manage your spending. Plan your budget.
                                Make every peso count.
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}
