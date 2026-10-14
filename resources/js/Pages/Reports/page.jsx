import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ChartNoAxesCombined, Receipt, Wallet, TrendingUp } from 'lucide-react';

const money = (amount) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(Number(amount) || 0);

export default function Reports({
    month,
    totalExpenses = 0,
    transactionCount = 0,
    categoryTotals = [],
    monthlySpending = [],
    budget = 0,
    remainingBudget = 0,
}) {
    const maxMonthlySpending = Math.max(
        ...monthlySpending.map((item) => Number(item.total)),
        1
    );

    const maxCategorySpending = Math.max(
        ...categoryTotals.map((item) => Number(item.total)),
        1
    );

    const budgetUsed = budget > 0
        ? Math.min((totalExpenses / budget) * 100, 100)
        : 0;

    return (
        <AuthenticatedLayout>
            <Head title="Reports & Analytics" />

            <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
                <div>
                    <p className="text-sm font-medium text-gray-500">
                        Financial Overview
                    </p>
                    <h1 className="mt-1 text-2xl font-black text-gray-900 sm:text-3xl">
                        Reports & Analytics
                    </h1>
                    <p className="mt-2 text-sm text-gray-500">
                        Understand your spending and track your budget.
                    </p>
                </div>

                {/* Summary cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        title="Total Expenses"
                        value={money(totalExpenses)}
                        subtitle={month}
                        icon={Receipt}
                    />

                    <SummaryCard
                        title="Monthly Budget"
                        value={money(budget)}
                        subtitle="Your spending limit"
                        icon={Wallet}
                    />

                    <SummaryCard
                        title="Remaining Budget"
                        value={money(remainingBudget)}
                        subtitle={
                            budget > 0 && remainingBudget < 0
                                ? 'You are over budget'
                                : 'Budget minus expenses'
                        }
                        icon={TrendingUp}
                    />

                    <SummaryCard
                        title="Transactions"
                        value={transactionCount}
                        subtitle="This month"
                        icon={ChartNoAxesCombined}
                    />
                </div>

                {/* Budget progress */}
                <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="font-bold text-gray-900">
                                Monthly Budget Usage
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                {money(totalExpenses)} spent out of {money(budget)}
                            </p>
                        </div>
                        <span className="text-sm font-bold text-gray-700">
                            {budget > 0
                                ? `${((totalExpenses / budget) * 100).toFixed(1)}%`
                                : 'No budget set'}
                        </span>
                    </div>

                    <div className="mt-4 h-3 overflow-hidden rounded-full bg-gray-100">
                        <div
                            className={`h-full rounded-full transition-all ${
                                budget > 0 && totalExpenses > budget
                                    ? 'bg-red-500'
                                    : 'bg-gray-900'
                            }`}
                            style={{ width: `${budgetUsed}%` }}
                        />
                    </div>

                    {budget === 0 && (
                        <p className="mt-3 text-sm text-gray-500">
                            Set a monthly budget in Budget Settings to track your progress.
                        </p>
                    )}
                </section>

                {/* Charts */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                        <h2 className="font-bold text-gray-900">
                            Monthly Spending
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Your spending over the last six months
                        </p>

                        <div className="mt-6 space-y-5">
                            {monthlySpending.map((item) => (
                                <div key={item.month}>
                                    <div className="mb-2 flex justify-between gap-3 text-sm">
                                        <span className="text-gray-600">
                                            {item.month}
                                        </span>
                                        <span className="font-semibold text-gray-900">
                                            {money(item.total)}
                                        </span>
                                    </div>
                                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                                        <div
                                            className="h-full rounded-full bg-gray-800"
                                            style={{
                                                width: `${(Number(item.total) / maxMonthlySpending) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                        <h2 className="font-bold text-gray-900">
                            Spending by Category
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                            Where your money goes this month
                        </p>

                        {categoryTotals.length === 0 ? (
                            <div className="mt-6 rounded-xl bg-gray-50 px-4 py-10 text-center">
                                <ChartNoAxesCombined className="mx-auto h-8 w-8 text-gray-400" />
                                <p className="mt-3 font-semibold text-gray-800">
                                    No expenses yet
                                </p>
                                <p className="mt-1 text-sm text-gray-500">
                                    Add expenses to see your category breakdown.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-6 space-y-5">
                                {categoryTotals
                                    .slice()
                                    .sort((a, b) => Number(b.total) - Number(a.total))
                                    .map((item) => (
                                        <div key={item.category}>
                                            <div className="mb-2 flex justify-between gap-3 text-sm">
                                                <span className="break-words text-gray-600">
                                                    {item.category}
                                                </span>
                                                <span className="shrink-0 font-semibold text-gray-900">
                                                    {money(item.total)}
                                                </span>
                                            </div>
                                            <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                                                <div
                                                    className="h-full rounded-full bg-gray-800"
                                                    style={{
                                                        width: `${(Number(item.total) / maxCategorySpending) * 100}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </section>
                </div>

                <p className="text-xs text-gray-400">
                    Reports are based on your recorded expenses. Monthly totals use expense dates.
                </p>
            </div>
        </AuthenticatedLayout>
    );
}

function SummaryCard({ title, value, subtitle, icon: Icon }) {
    return (
        <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-gray-500">
                    {title}
                </p>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                    <Icon className="h-5 w-5 text-gray-700" />
                </div>
            </div>

            <p className="mt-4 break-words text-2xl font-black text-gray-900">
                {value}
            </p>
            <p className="mt-1 text-xs text-gray-500">
                {subtitle}
            </p>
        </section>
    );
}
