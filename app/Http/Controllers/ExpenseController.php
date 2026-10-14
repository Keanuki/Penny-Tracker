<?php

namespace App\Http\Controllers;

use App\Models\Expense;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExpenseController extends Controller
{
    public function index()
    {
        $expenses = auth()->user()
            ->expenses()
            ->latest('expense_date')
            ->get();

        return Inertia::render('Expenses/page', [
            'expenses' => $expenses,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'category' => 'required|string|max:255',
            'expense_date' => 'required|date',
            'description' => 'nullable|string|max:1000',
        ]);

        $request->user()->expenses()->create($validated);

        
        return back()->with('success', 'Expense added successfully!');
    }

    public function update(Request $request, Expense $expense)
    {
        abort_unless(
            $request->user()->id === $expense->user_id,
            403
        );

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0.01',
            'category' => 'required|string|max:255',
            'expense_date' => 'required|date',
            'description' => 'nullable|string|max:1000',
        ]);

        $expense->update($validated);

        return back()->with('success', 'Expense updated successfully!');
    }

    public function destroy(Request $request, Expense $expense)
    {
        abort_unless(
            $request->user()->id === $expense->user_id,
            403
        );

        $expense->delete();

        return back()->with('success', 'Expense deleted successfully!');
    }
}

