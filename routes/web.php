<?php

use App\Http\Controllers\ReportController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ExpenseController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});


Route::get('/dashboard', function () {
    $user = auth()->user();
    $now = now();
    $month = $now->format('Y-m');

    $budget = (float) ($user->budgets()
        ->where('month', $month)
        ->value('amount') ?? 0);

    $expenses = $user->expenses()
        ->whereYear('expense_date', $now->year)
        ->whereMonth('expense_date', $now->month)
        ->latest('expense_date')
        ->get();

    $totalExpenses = (float) $expenses->sum('amount');

    $categoryTotals = $expenses
        ->groupBy('category')
        ->map(fn ($items, $category) => [
            'category' => $category,
            'total' => (float) $items->sum('amount'),
        ])
        ->values();

    return Inertia::render('Dashboard/page', [
        'month' => $month,
        'budget' => $budget,
        'totalExpenses' => $totalExpenses,
        'remainingBudget' => $budget - $totalExpenses,
        'transactionCount' => $expenses->count(),
        'recentExpenses' => $expenses->take(5)->values(),
        'categoryTotals' => $categoryTotals,
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');


Route::middleware('auth')->group(function () {

    Route::get('/reports', [ReportController::class, 'index'])
    ->name('reports.index');

    Route::get('/budget-settings', [BudgetController::class, 'index'])
        ->name('budget.index');

    Route::post('/budget-settings', [BudgetController::class, 'store'])
        ->name('budget.store');

    Route::get('/expenses', [ExpenseController::class, 'index'])
    ->name('expenses.index');

    Route::post('/expenses', [ExpenseController::class, 'store'])
        ->name('expenses.store');

    
    Route::put('/expenses/{expense}', [ExpenseController::class, 'update'])
    ->name('expenses.update');

    Route::delete('/expenses/{expense}', [ExpenseController::class, 'destroy'])
    ->name('expenses.destroy');

    
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/products', fn () => Inertia::render('Products/page'))->name('products');
});

require __DIR__.'/auth.php';

