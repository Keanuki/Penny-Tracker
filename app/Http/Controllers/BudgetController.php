<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class BudgetController extends Controller
{
    public function index(Request $request)
    {
        $currentMonth = now()->format('Y-m');

        $validated = $request->validate([
            'month' => [
                'sometimes',
                'required',
                'regex:/^\d{4}-(0[1-9]|1[0-2])$/',
            ],
        ]);

        $month = $validated['month'] ?? $currentMonth;

        $selectedDate = \Carbon\Carbon::createFromFormat(
            '!Y-m',
            $month
        );

        $budget = auth()->user()
            ->budgets()
            ->where('month', $month)
            ->first();

        $totalExpenses = auth()->user()
            ->expenses()
            ->whereYear('expense_date', $selectedDate->year)
            ->whereMonth('expense_date', $selectedDate->month)
            ->sum('amount');

        $budgetAmount = (float) ($budget?->amount ?? 0);

        return Inertia::render('BudgetSettings/page', [
            'month' => $month,
            'currentMonth' => $currentMonth,
            'budget' => $budgetAmount,
            'totalExpenses' => (float) $totalExpenses,
            'remainingBudget' => $budgetAmount - (float) $totalExpenses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'month' => [
                'required',
                'regex:/^\d{4}-(0[1-9]|1[0-2])$/',
            ],
            'amount' => [
                'required',
                'numeric',
                'min:0.01',
                'max:9999999999',
            ],
        ]);

        auth()->user()->budgets()->updateOrCreate(
            ['month' => $validated['month']],
            ['amount' => $validated['amount']]
        );

        return redirect()
            ->route('budget.index', ['month' => $validated['month']])
            ->with('success', 'Monthly budget saved successfully!');
    }
}
