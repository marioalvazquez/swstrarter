<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SwapiEvent;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use Carbon\Carbon;

class EventController extends Controller
{
    /**
     * Store an incoming tracking event.
     *
     * Expected payload (JSON):
     * {
     *   "client_id": "uuid",
     *   "resource_type": "people",
     *   "route": "/api/people?name=luke",
     *   "query_string": "name=luke",
     *   "duration_ms": 123,
     *   "status_code": 200,
     *   "user_agent": "...",
     *   "ip": "1.2.3.4", // optional - we'll hash it
     *   "occurred_at": "2025-08-26T15:00:00Z" // optional - default now
     * }
     */
    public function store(Request $request)
    {
        $payload = $request->validate([
            'client_id' => 'required|string',
            'resource_type' => 'required|string',
            'route' => 'required|string',
            'query_string' => 'nullable|string',
            'duration_ms' => 'nullable|integer',
            'status_code' => 'nullable|integer',
            'user_agent' => 'nullable|string',
            'ip' => 'nullable|ip',
            'occurred_at' => 'nullable|date',
        ]);

        // Hash IP for privacy
        $ipHash = null;
        if (!empty($payload['ip'])) {
            $ipHash = hash_hmac('sha256', $payload['ip'], config('app.key')); // TODO: explain hash_hmac
        } else {
            $ipHeader = $request->ip();
            if ($ipHeader) {
                $ipHash = hash_hmac('sha256', $ipHeader, config('app.key'));
            }
        }

        $event = SwapiEvent::create([
            'client_id' => $payload['client_id'],
            'resource_type' => $payload['resource_type'],
            'route' => $payload['route'],
            'query_string' => $payload['query_string'] ?? null,
            'duration_ms' => $payload['duration_ms'] ?? null,
            'status_code' => $payload['status_code'] ?? null,
            'user_agent' => $payload['user_agent'] ?? $request->header('user-agent'),
            'ip_hash' => $ipHash,
            'occurred_at' => $payload['occurred_at'] ?? Carbon::now(),
        ]);

        return response()->json(['ok' => true, 'id' => $event->id], 201);
    }
}
