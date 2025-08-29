<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Jobs\ComputeStatsJob;
use Illuminate\Support\Facades\Log;

class RecomputeStats extends Command
{
    protected $signature = 'stats:recompute';
    protected $description = 'Dispatch computation job to recompute statistics (should be scheduled every 5 minutes).';

    public function handle()
    {
        ComputeStatsJob::dispatch();
    }
}
