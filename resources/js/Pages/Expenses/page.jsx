import { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    Receipt,
    CalendarDays,
    Tags,
    Plus,
    Trash2,
    Pencil,
    X,
    Search,
    Wallet,
} from 'lucide-react';

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

const money = (amount) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(Number(amount) || 0);

const getCurrentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const getExpenseDate = (date) => String(date || '').slice(0, 10);

export default function Expenses({ expenses = [] }) {
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [search, setSearch] = useState('');

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
    } = useForm({
        title: '',
        amount: '',
        category: 'Food',
        expense_date: new Date().toLocaleDateString('en-CA'),
        description: '',
    });

    const {
        data: editData,
        setData: setEditData,
        put,
        processing: editProcessing,
        errors: editErrors,
        reset: resetEdit,
    } = useForm({
        title: '',
        amount: '',
        category: 'Food',
        expense_date: '',
        description: '',
    });

    const currentMonth = getCurrentMonth();

    const monthlyExpenses = expenses.filter(
        (expense) => getExpenseDate(expense.expense_date).slice(0, 7) === currentMonth
    );

    const monthlyTotal = monthlyExpenses.reduce(
        (sum, expense) => sum + Number(expense.amount || 0),
        0
    );

    const categoryTotals = monthlyExpenses.reduce((totals, expense) => {
        const category = expense.category || 'Other';
        totals[category] = (totals[category] || 0) + Number(expense.amount || 0);
        return totals;
    }, {});

    const topCategory = Object.entries(categoryTotals).sort(
        (a, b) => b[1] - a[1]
    )[0];

    const filteredExpenses = expenses.filter((expense) => {
        const term = search.trim().toLowerCase();

        return (
            !term ||
            expense.title?.toLowerCase().includes(term) ||
            expense.category?.toLowerCase().includes(term) ||
            expense.description?.toLowerCase().includes(term)
        );
    });

    function submitExpense(e) {
        e.preventDefault();

        post('/expenses', {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    }

    function startEditing(expense) {
        setShowForm(false);
        setEditingId(expense.id);

        setEditData({
            title: expense.title || '',
            amount: expense.amount || '',
            category: expense.category || 'Food',
            expense_date: getExpenseDate(expense.expense_date),
            description: expense.description || '',
        });
    }

    function cancelEditing() {
        setEditingId(null);
        resetEdit();
    }

    function submitEdit(e) {
        e.preventDefault();

        put(`/expenses/${editingId}`, {
            onSuccess: () => {
                setEditingId(null);
                resetEdit();
            },
        });
    }

    function deleteExpense(id) {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            router.delete(`/expenses/${id}`);
        }
    }

    return (
        <AuthenticatedLayout>
            <Head title="My Expenses" />

            <div className="min-w-0">
                <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">

                    {/* Page heading */}
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Manage Your Money
                            </p>
                            <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-900 sm:text-3xl">
                                My Expenses
                            </h1>
                            <p className="mt-2 text-sm text-gray-500">
                                Track, organize, and review your spending.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Link
                                href="/dashboard"
                                className="inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                            >
                                Dashboard
                            </Link>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowForm((open) => !open);
                                    setEditingId(null);
                                    resetEdit();
                                }}
                               className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-gray-700"
                            >
                                {showForm ? (
                                    <X className="h-4 w-4" />
                                ) : (
                                    <Plus className="h-4 w-4" />
                                )}
                                {showForm ? 'Cancel' : 'Add Expense'}
                            </button>
                        </div>
                    </div>

                    {/* Summary cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <SummaryCard
                            title="Spent This Month"
                            value={money(monthlyTotal)}
                            subtitle="Total expenses this month"
                            icon={Wallet}
                        />

                        <SummaryCard
                            title="Transactions"
                            value={monthlyExpenses.length}
                            subtitle="Expenses recorded this month"
                            icon={Receipt}
                        />

                        <SummaryCard
                            title="Top Category"
                            value={topCategory ? topCategory[0] : 'No expenses'}
                            subtitle={
                                topCategory
                                    ? `${money(topCategory[1])} spent this month`
                                    : 'Your highest spending category'
                            }
                            icon={Tags}
                        />
                    </div>

                    {/* Add expense form */}
                    {showForm && (
                        <ExpenseForm
                            title="Add New Expense"
                            data={data}
                            setData={setData}
                            errors={errors}
                            processing={processing}
                            onSubmit={submitExpense}
                            submitLabel="Save Expense"
                            onCancel={() => {
                                setShowForm(false);
                                reset();
                            }}
                        />
                    )}

                    {/* Expense history */}
                    <section className="min-w-0 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">
                                    Expense History
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    View and manage your recorded expenses.
                                </p>
                            </div>

                            <div className="relative w-full sm:max-w-xs">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="search"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search expenses..."
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900"
                                />
                            </div>
                        </div>

                        <div className="mt-5">
                            {filteredExpenses.length === 0 ? (
                                <div className="rounded-xl bg-gray-50 px-4 py-12 text-center">
                                    <Receipt className="mx-auto h-9 w-9 text-gray-400" />
                                    <p className="mt-3 font-semibold text-gray-800">
                                        {expenses.length === 0
                                            ? 'No expenses yet'
                                            : 'No matching expenses'}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {expenses.length === 0
                                            ? 'Add your first expense to see it here.'
                                            : 'Try another search term.'}
                                    </p>

                                    {expenses.length === 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(true)}
                                            className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white hover:bg-gray-700"
                                        >
                                            Add your first expense
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {filteredExpenses.map((expense) => (
                                        <div
                                            key={expense.id}
                                            className="rounded-xl border border-gray-100 bg-white p-4 transition hover:border-gray-200 hover:bg-gray-50/70 sm:p-5"
                                        >
                                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                                <div className="flex min-w-0 items-start gap-3">
                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                                                        <Receipt className="h-5 w-5 text-gray-700" />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <h3 className="break-words font-bold text-gray-900">
                                                            {expense.title}
                                                        </h3>

                                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-700">
                                                                {expense.category}
                                                            </span>

                                                            <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                                                                <CalendarDays className="h-3.5 w-3.5" />
                                                                {getExpenseDate(expense.expense_date)}
                                                            </span>
                                                        </div>

                                                        {expense.description && (
                                                            <p className="mt-2 break-words text-sm text-gray-500">
                                                                {expense.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3 sm:justify-end sm:border-0 sm:pt-0">
                                                    <p className="text-lg font-black text-gray-900 sm:text-right">
                                                        {money(expense.amount)}
                                                    </p>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => startEditing(expense)}
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            aria-label={`Delete ${expense.title}`}
                                                            onClick={() => deleteExpense(expense.id)}
                                                            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {editingId === expense.id && (
                                                <div className="mt-5 border-t border-gray-200 pt-5">
                                                    <ExpenseForm
                                                        title="Edit Expense"
                                                        data={editData}
                                                        setData={setEditData}
                                                        errors={editErrors}
                                                        processing={editProcessing}
                                                        onSubmit={submitEdit}
                                                        submitLabel="Save Changes"
                                                        onCancel={cancelEditing}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {filteredExpenses.length > 0 && (
                            <p className="mt-5 border-t border-gray-100 pt-4 text-xs text-gray-500">
                                Showing {filteredExpenses.length} of {expenses.length} expenses
                            </p>
                        )}
                    </section>
                </div>
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

function ExpenseForm({
    title,
    data,
    setData,
    errors = {},
    processing,
    onSubmit,
    submitLabel,
    onCancel,
}) {
    const fieldClass =
        'mt-1 w-full min-w-0 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none transition focus:border-gray-900 focus:bg-white focus:ring-1 focus:ring-gray-900';

    return (
        <form
            onSubmit={onSubmit}
            className="space-y-5 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6"
        >
            <div>
                <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                <p className="mt-1 text-sm text-gray-500">
                    Enter the details of your expense below.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                    <label className="text-sm font-semibold text-gray-700">
                        Expense Title
                    </label>
                    <input
                        required
                        value={data.title}
                        onChange={(e) => setData('title', e.target.value)}
                        className={fieldClass}
                        placeholder="e.g. Lunch"
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-700">
                        Amount (₱)
                    </label>
                    <input
                        required
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={data.amount}
                        onChange={(e) => setData('amount', e.target.value)}
                        className={`${fieldClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                        placeholder="85.00"
                    />
                    {errors.amount && (
                        <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
                    )}
                </div>

                <div>
                    <label className="text-sm font-semibold text-gray-700">
                        Category
                    </label>
                    <select
                        value={data.category}
                        onChange={(e) => setData('category', e.target.value)}
                        className={fieldClass}
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

                <div>
                    <label className="text-sm font-semibold text-gray-700">
                        Date
                    </label>
                    <input
                        required
                        type="date"
                        value={data.expense_date}
                        onChange={(e) => setData('expense_date', e.target.value)}
                        className={fieldClass}
                    />
                    {errors.expense_date && (
                        <p className="mt-1 text-sm text-red-600">{errors.expense_date}</p>
                    )}
                </div>

                <div className="sm:col-span-2">
                    <label className="text-sm font-semibold text-gray-700">
                        Description (Optional)
                    </label>
                    <textarea
                        rows={3}
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className={fieldClass}
                        placeholder="Add some details..."
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-gray-100 pt-4">
                <button
                    type="submit"
                    disabled={processing}
                    className="rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:opacity-50"
                >
                    {processing ? 'Saving...' : submitLabel}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
