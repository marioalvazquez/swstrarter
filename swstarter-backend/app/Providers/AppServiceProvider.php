<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Request;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Límite genérico para API
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(600)->by($request->ip());
        });

        // Límite específico para /events
        RateLimiter::for('events', function (Request $request) {
            return Limit::perMinute(300)->by($request->ip());
        });
    }
}
