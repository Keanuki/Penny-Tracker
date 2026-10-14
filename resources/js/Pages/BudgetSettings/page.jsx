import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { CircleArrowLeft } from 'lucide-react';

const money = (amount) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(Number(amount || 0));

export default function BudgetSettings({
    month = '',
    budget = 0,
    totalExpenses = 0,
    remainingBudget = 0,
}) {
    const { data, setData, post, processing, errors } = useForm({
        amount: budget > 0 ? String(budget) : '',
    });

    function submitBudget(e) {
        e.preventDefault();
        post('/budget-settings');
    }

    return (
        <AuthenticatedLayout>
            <Head title="Budget Settings" />

            <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-4xl space-y-6">
                    <div>
                        <Link
                            href="/dashboard"
                            className="text-sm font-medium text-gray-500 hover:text-gray-900"
                        >
                            <CircleArrowLeft />
                        </Link>

                        <h1 className="mt-4 text-3xl font-bold text-gray-900">
                            Budget Settings
                        </h1>

                        <p className="mt-2 text-gray-500">
                            Set your monthly spending limit and manage your money.
                        </p>
                    </div>

                    {Number(budget) <= 0 && (
                        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                            <p className="font-semibold text-amber-900">
                                No monthly budget set
                            </p>
                            <p className="mt-1 text-sm text-amber-800">
                                Set your budget below to start tracking your spending.
                            </p>
                        </div>
                    )}

                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="text-lg font-bold text-gray-900">
                            Monthly Budget
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Budget period: {month}
                        </p>

                        <form onSubmit={submitBudget} className="mt-6 space-y-5">
                            <div>
                                <label
                                    htmlFor="amount"
                                    className="mb-2 block text-sm font-semibold text-gray-700"
                                >
                                    Monthly budget amount (₱)
                                </label>

                                <div className="flex w-full max-w-sm items-center rounded-xl border border-gray-300 focus-within:border-gray-500 focus-within:ring-2 focus-within:ring-gray-100">
                                    <span className="pl-4 text-gray-500">₱</span>

                                    <input
                                        id="amount"
                                        type="number"
                                        min="100"
                                        max="9999999999"
                                        step="100"
                                        required
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        placeholder="e.g. 5000"
                                        className="w-full min-w-0 border-0 bg-transparent p-3 text-gray-900 outline-none focus:ring-0"
                                    />
                                </div>

                                {errors.amount && (
                                    <p className="mt-2 text-sm text-red-600">
                                        {errors.amount}
                                    </p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:opacity-50 sm:w-auto"
                            >
                                {processing ? 'Saving...' : 'Save Budget'}
                            </button>
                        </form>
                    </section>

                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-gray-200 bg-white p-5">
                            <p className="text-sm text-gray-500">Monthly Budget</p>
                            <p className="mt-2 break-words text-2xl font-bold text-gray-900">
                                {money(budget)}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5">
                            <p className="text-sm text-gray-500">Total Spent</p>
                            <p className="mt-2 break-words text-2xl font-bold text-gray-900">
                                {money(totalExpenses)}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-gray-200 bg-white p-5">
                            <p className="text-sm text-gray-500">Remaining Budget</p>
                            <p className={`mt-2 break-words text-2xl font-bold ${
                                Number(remainingBudget) < 0
                                    ? 'text-red-600'
                                    : 'text-gray-900'
                            }`}>
                                {money(remainingBudget)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
