<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\StatsSnapshot;
use Illuminate\Http\Request;
use Carbon\Carbon;

class StatsController extends Controller
{
    /**
     * Return the latest snapshot.
     */
    public function index(Request $request)
    {
        $latest = StatsSnapshot::orderBy('snapshot_at', 'desc')->first();

        if (!$latest) {
            return response()->json(['message' => 'No stats available yet.'], 404);
        }

        return response()->json([
            'snapshot_at' => $latest->snapshot_at->toIso8601String(),
            'payload' => $latest->payload,
        ]);
    }

    /**
     * Return snapshot for a specific timestamp (format: ISO8601 or UNIX)
     */
    public function show($timestamp)
    {
        // try ISO or numeric
        $dt = null;
        try {
            $dt = Carbon::parse($timestamp);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Invalid timestamp format. Use ISO8601.'], 400);
        }

        $snapshot = StatsSnapshot::where('snapshot_at', $dt->toDateTimeString())->first();

        if (!$snapshot) {
            return response()->json(['message' => 'Snapshot not found.'], 404);
        }

        return response()->json([
            'snapshot_at' => $snapshot->snapshot_at->toIso8601String(),
            'payload' => $snapshot->payload,
        ]);
    }
}
