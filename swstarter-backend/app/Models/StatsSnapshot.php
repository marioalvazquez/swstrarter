<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Stores the computed aggregated statistics every 5 minutes.
 * payload is a JSON blob with our metrics schema.
 */
class StatsSnapshot extends Model
{
    protected $table = 'stats_snapshots';

    protected $fillable = [
        'snapshot_at',
        'payload',
    ];

    protected $casts = [
        'snapshot_at' => 'datetime',
        'payload' => 'array',
    ];
}
