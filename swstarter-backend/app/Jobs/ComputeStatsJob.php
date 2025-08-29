<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Carbon;
use App\Models\SwapiEvent;
use App\Models\StatsSnapshot;
use Illuminate\Support\Facades\DB;

class ComputeStatsJob2 implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        $now = Carbon::now();

        // 1) Select events window we need. We'll read 90 days but in practice only recent 7d matters.
        $events = SwapiEvent::where('occurred_at', '>=', $now->copy()->subDays(90))
            ->orderBy('occurred_at', 'asc')
            ->get(['resource_type', 'route', 'duration_ms', 'status_code', 'occurred_at']);

        // Helper to slice to ranges
        $byRange = function($hours) use ($events, $now) {
            $from = $now->copy()->subHours($hours);
            return $events->filter(function ($e) use ($from) {
                return $e->occurred_at->gte($from);
            });
        };

        $computeFor = function($collection) {
            // total count
            $total = $collection->count();

            // top 5 routes
            $topRoutes = $collection->groupBy('route')->map(function($group) {
                return $group->count();
            })->sortDesc()->take(5)->map(function($count, $route) use ($collection) {
                return ['route' => $route, 'count' => $count];
            })->values();

            // average latency and p95
            $durations = $collection->pluck('duration_ms')->filter()->map(function($v) {
                return (int)$v;
            })->sort()->values();

            $avg = $durations->count() ? (int) round($durations->avg()) : null;
            $p95 = null;
            if ($durations->count()) {
                $idx = (int) floor(0.95 * ($durations->count() - 1));
                $p95 = $durations->get($idx);
            }

            // error rate (status_code >= 400)
            $errors = $collection->filter(function($e) {
                return $e->status_code && $e->status_code >= 400;
            })->count();
            $errorRate = $total ? ($errors / $total) : null;

            // heatmap by hour of day (0-23)
            $hours = array_fill(0, 24, 0);
            foreach ($collection as $e) {
                $h = (int) $e->occurred_at->format('G'); // 0..23
                $hours[$h]++;
            }

            return [
                'total_events' => $total,
                'top_routes' => $topRoutes,
                'latency' => [
                    'avg_ms' => $avg,
                    'p95_ms' => $p95,
                ],
                'error_rate' => $errorRate === null ? null : round($errorRate, 4),
                'hourly' => $hours,
            ];
        };

        $snapshot = [
            'computed_at' => $now->toIso8601String(),
            'last_24h' => $computeFor($byRange(24)),
            'last_7d' => $computeFor($byRange(24*7)),
            'history_window_days' => 90,
        ];

        StatsSnapshot::create([
            'snapshot_at' => $now,
            'payload' => $snapshot,
        ]);
    }
}
