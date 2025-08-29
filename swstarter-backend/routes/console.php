<?php

use Illuminate\Support\Facades\Schedule;

Schedule::command('stats:recompute')->everyFiveMinutes();
Schedule::command('stats:prune')->daily();
