<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SuperAdmin\SchoolController;
use App\Http\Controllers\SuperAdmin\AdminController;

Route::prefix('super-admin')
    ->middleware(['auth:sanctum', 'role:super_admin'])
    ->group(function () {
        // Écoles
        Route::apiResource('schools', SchoolController::class);
        // Administrateurs
        Route::apiResource('admins', AdminController::class);
        Route::put('admins/{id}/toggle', [AdminController::class, 'toggle']);
    });

