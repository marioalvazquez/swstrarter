<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateStatsSnapshotsTable extends Migration
{
    public function up()
    {
        Schema::create('stats_snapshots', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->timestamp('snapshot_at')->index(); // when snapshot was taken
            $table->json('payload'); // aggregated JSON
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('stats_snapshots');
    }
}
