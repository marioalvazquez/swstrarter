<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Represents a single tracking event sent from the frontend.
 * Fields are intentionally simple: route + resource_type + duration + status + occurred_at.
 */
class SwapiEvent extends Model
{
    protected $table = 'swapi_events';

    protected $fillable = [
        'client_id',
        'resource_type',
        'route',
        'query_string',
        'duration_ms',
        'status_code',
        'user_agent',
        'ip_hash',
        'occurred_at',
    ];

    protected $casts = [
        'occurred_at' => 'datetime',
    ];
}
