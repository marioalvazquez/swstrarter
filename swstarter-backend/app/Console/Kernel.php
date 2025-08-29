<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

use App\Console\Commands\PruneEvents;
use App\Console\Commands\RecomputeStats;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        PruneEvents::class,
        RecomputeStats::class,
    ];

    protected function schedule(Schedule $schedule): void
    {
        
        $schedule->command('stats:prune')->daily();

        $schedule->command('stats:recompute')->everyMinute();
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
