<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\EventController;
use App\Http\Controllers\Api\V1\StatsController;

// Prefijo v1 para la API
Route::prefix('v1')->group(function () {

    // Events endpoint (tracking) - rate limited
    Route::post('/events', [EventController::class, 'store'])
         ->middleware('throttle:events');

    // Stats endpoints (read-only)
    Route::get('/stats', [StatsController::class, 'index']);
    Route::get('/stats/{timestamp}', [StatsController::class, 'show']);
});
