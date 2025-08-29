<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSwapiEventsTable extends Migration
{
    public function up()
    {
        Schema::create('swapi_events', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('client_id')->index(); // UUID from FE
            $table->string('resource_type'); // people | films | other
            $table->string('route')->index(); // full path e.g. /api/people?name=luke or /api/people/1
            $table->string('query_string')->nullable();
            $table->integer('duration_ms')->nullable();
            $table->smallInteger('status_code')->nullable();
            $table->string('user_agent')->nullable();
            $table->string('ip_hash')->nullable(); // hashed IP for privacy
            $table->timestamp('occurred_at')->index();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('swapi_events');
    }
}
