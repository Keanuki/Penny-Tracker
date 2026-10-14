
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Target } from 'lucide-react'
import { Receipt } from 'lucide-react'
import { Wallet } from 'lucide-react'
import { ArrowLeftRight } from 'lucide-react'

const money = (amount) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(Number(amount || 0));

const categories = [
    'Food',
    'Transportation',
    'School',
    'Bills',
    'Shopping',
    'Health',
    'Entertainment',
    'Other',
];

export default function Dashboard({
    totalExpenses = 0,
    budget = 0,
    remainingBudget = 0,
    transactionCount = 0,
    recentExpenses = [],
    categoryTotals = [],
    month = '',
}) {
    const [showAddExpense, setShowAddExpense] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        amount: '',
        category: 'Food',
        expense_date: new Date().toLocaleDateString('en-CA'),
        description: '',
    });

    const submitExpense = (e) => {
        e.preventDefault();

        post('/expenses', {
            onSuccess: () => {
                reset();
                setShowAddExpense(false);
            },
        });
    };

    const spentPercentage =
        budget > 0
            ? Math.min((Number(totalExpenses) / Number(budget)) * 100, 100)
            : 0;

    const cards = [
        {
            label: 'Monthly Budget',
            amount: budget,
            note: 'Your spending limit',
            icon: <Target />,
        },
        {
            label: 'Total Expenses',
            amount: totalExpenses,
            note: 'Spent this month',
            icon: <Receipt />,
        },
        {
            label: 'Remaining Balance',
            amount: remainingBudget,
            note: remainingBudget < 0 ? 'Over your budget' : 'Available to spend',
            icon: <Wallet />,
        },
        {
            label: 'Transactions',
            amount: transactionCount,
            note: 'This month',
            icon: <ArrowLeftRight />,
            isCount: true,
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="PennyTrack Dashboard" />

            <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl space-y-8">

                    {/* Welcome section */}
                    <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
                                {month} 
                            </p>

                            <h1 className="mt-2 text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">
                                Welcome to PennyTrack.
                            </h1>

                            <p className="mt-2 text-gray-500">
                                Keep your money organized and your goals on track.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowAddExpense(true)}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-gray-700"
                        >
                            <span className="text-xl">+</span>
                            Add Expense
                        </button>
                    </section>

                    {/* Summary cards */}
                    <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                        {cards.map((card) => (
                            <div
                            key={card.label}
                            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-medium text-gray-500">
                                        {card.label}
                                    </p>

                                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-lg font-bold text-gray-800">
                                        {card.icon}
                                    </span>
                                </div>

                                <p className="mt-5 break-words text-2xl font-black text-gray-900">
                                    {card.isCount
                                        ? Number(card.amount || 0).toLocaleString()
                                        : money(card.amount)}
                                </p>

                                <p className="mt-2 text-sm text-gray-500">
                                    {card.note}
                                </p>
                            </div>
                        ))}
                    </section>

                    {/* Spending progress */}
                    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Monthly spending
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    {budget > 0
                                        ? `${((Number(totalExpenses) / Number(budget)) * 100).toFixed(1)}% of your budget used`
                                        : 'Set a monthly budget to track your progress.'}
                                </p>
                            </div>

                            <p className="font-bold text-gray-900">
                                {money(totalExpenses)}{' '}
                                <span className="font-normal text-gray-400">
                                    / {money(budget)}
                                </span>
                            </p>
                        </div>

                        <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-100">
                            <div
                                className={`h-full rounded-full transition-all ${
                                    totalExpenses > budget && budget > 0
                                        ? 'bg-red-500'
                                        : 'bg-gray-900'
                                }`}
                                style={{ width: `${spentPercentage}%` }}
                            />
                        </div>

                        {budget === 0 && (
                            <Link
                                href="/budget-settings"
                                className="mt-4 inline-block text-sm font-semibold text-gray-800 underline underline-offset-4 hover:text-gray-500"
                            >
                                Set your monthly budget
                            </Link>
                        )}
                    </section>

                    {/* Recent expenses and category breakdown */}
                    <section className="grid gap-6 lg:grid-cols-2">

                        {/* Recent expenses */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        Recent Expenses
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Your latest spending this month.
                                    </p>
                                </div>

                                <Link
                                    href="/expenses"
                                    className="shrink-0 text-sm font-semibold text-gray-700 underline underline-offset-4 hover:text-black"
                                >
                                    View all
                                </Link>
                            </div>

                            {recentExpenses.length === 0 ? (
                                <div className="rounded-xl bg-gray-50 px-4 py-10 text-center">
                                    <p className="font-semibold text-gray-800">
                                        No expenses yet
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        Add your first expense to see it here.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setShowAddExpense(true)}
                                        className="mt-4 text-sm font-semibold text-gray-900 underline underline-offset-4"
                                    >
                                        Add an expense
                                    </button>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {recentExpenses.map((expense) => (
                                        <div
                                            key={expense.id}
                                            className="flex items-center justify-between gap-4 py-4"
                                        >
                                            <div className="min-w-0">
                                                <p className="truncate font-semibold text-gray-900">
                                                    {expense.title}
                                                </p>
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {expense.category} ·{' '}
                                                    {String(expense.expense_date).slice(0, 10)}
                                                </p>
                                            </div>

                                            <p className="whitespace-nowrap font-bold text-gray-900">
                                                {money(expense.amount)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Category breakdown */}
                        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900">
                                Spending by Category
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                See where your money goes.
                            </p>

                            {categoryTotals.length === 0 ? (
                                <div className="py-10 text-center text-sm text-gray-500">
                                    Your category breakdown will appear after you add expenses this month.
                                </div>
                            ) : (
                                <div className="mt-6 space-y-5">
                                    {categoryTotals.map((item) => {
                                        const percentage =
                                            Number(totalExpenses) > 0
                                                ? (Number(item.total) /
                                                      Number(totalExpenses)) *
                                                  100
                                                : 0;

                                        return (
                                            <div key={item.category}>
                                                <div className="mb-2 flex justify-between gap-3 text-sm">
                                                    <span className="font-semibold text-gray-700">
                                                        {item.category}
                                                    </span>
                                                    <span className="font-medium text-gray-600">
                                                        {money(item.total)}
                                                    </span>
                                                </div>

                                                <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                                                    <div
                                                        className="h-full rounded-full bg-gray-800"
                                                        style={{
                                                            width: `${Math.min(percentage, 100)}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>

            {/* Add Expense modal */}
            {showAddExpense && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/10 p-4"
                    onMouseDown={(e) => {
                        if (e.target === e.currentTarget) {
                            setShowAddExpense(false);
                        }
                    }}
                >
                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="add-expense-title"
                        className="my-auto max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
                    >
                        <div className="mb-6 flex items-start justify-between gap-4">
                            <div>
                                <h2
                                    id="add-expense-title"
                                    className="text-2xl font-black text-gray-900"
                                >
                                    Add Expense
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Enter the details of your spending.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowAddExpense(false)}
                                aria-label="Close modal"
                                className="rounded-lg px-3 py-1 text-2xl text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                            >
                                ×
                            </button>
                        </div>

                        <form onSubmit={submitExpense} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Expense Title
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="e.g. Lunch"
                                    required
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                                        Amount (₱)
                                    </label>                                  
                                    <input
                                        type="number"
                                        min="0.01"
                                        step="0.01"
                                        inputMode="decimal"
                                        value={data.amount}
                                        onChange={(e) => setData('amount', e.target.value)}
                                        placeholder="Enter exact amount"
                                        required      
                                        className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                    />
                                    {errors.amount && (
                                        <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-semibold text-gray-700">
                                        Category
                                    </label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        required
                                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                    >
                                        {categories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && (
                                        <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    value={data.expense_date}
                                    onChange={(e) => setData('expense_date', e.target.value)}
                                    required
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                />
                                {errors.expense_date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.expense_date}</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-semibold text-gray-700">
                                    Description (Optional)
                                </label>
                                <textarea
                                    rows="3"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Add a note..."
                                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                )}
                            </div>

                            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowAddExpense(false)}
                                    className="rounded-xl border border-gray-300 px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Expense'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
