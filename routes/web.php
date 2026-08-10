<?php

use App\Http\Controllers\ClientController;
use App\Http\Controllers\HealthController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');
Route::get('/ready', [HealthController::class, 'readiness'])->name('readiness');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth'])->group(function () {
    Route::resource('clients', ClientController::class)->except('destroy');
    Route::patch('clients/{client}/status', [ClientController::class, 'updateStatus'])
        ->name('clients.update-status');
});

require __DIR__.'/settings.php';
