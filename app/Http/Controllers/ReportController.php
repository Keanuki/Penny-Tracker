<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $now = now();

        // Expenses for the current month
        $expenses = $user->expenses()
            ->whereYear('expense_date', $now->year)
            ->whereMonth('expense_date', $now->month)
            ->get();

        $totalExpenses = (float) $expenses->sum('amount');

        // Spending grouped by category
        $categoryTotals = $expenses
            ->groupBy('category')
            ->map(fn ($items, $category) => [
                'category' => $category,
                'total' => (float) $items->sum('amount'),
            ])
            ->values();

        // Monthly spending for the last six months
        $monthlySpending = collect(range(5, 0))
            ->map(function ($monthsAgo) use ($user, $now) {
                $date = $now->copy()->startOfMonth()
                    ->subMonths($monthsAgo);

                $total = $user->expenses()
                    ->whereYear('expense_date', $date->year)
                    ->whereMonth('expense_date', $date->month)
                    ->sum('amount');

                return [
                    'month' => $date->format('M Y'),
                    'total' => (float) $total,
                ];
            })
            ->values();

        // Current month's budget
        $budget = (float) ($user->budgets()
            ->where('month', $now->format('Y-m'))
            ->value('amount') ?? 0);

        return Inertia::render('Reports/page', [
            'month' => $now->format('F Y'),
            'totalExpenses' => $totalExpenses,
            'transactionCount' => $expenses->count(),
            'categoryTotals' => $categoryTotals,
            'monthlySpending' => $monthlySpending,
            'budget' => $budget,
            'remainingBudget' => $budget - $totalExpenses,
        ]);
    }
}
