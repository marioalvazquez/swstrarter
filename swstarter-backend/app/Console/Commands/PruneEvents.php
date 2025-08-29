<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\SwapiEvent;
use Carbon\Carbon; 

class PruneEvents extends Command {
    protected $signature = 'stats:prune';
    protected $description = 'Job to prune Events (should be scheduled every day).';

    public function handle() {
        SwapiEvent::where('occurred_at', '<', Carbon::now()->subDays(90))->delete();
    }
}