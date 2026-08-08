<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Throwable;

class HealthController extends Controller
{
    public function readiness(): JsonResponse
    {
        $checks = [
            'database' => fn () => DB::select('SELECT 1'),
            'redis' => fn () => Redis::connection()->ping(),
            'storage' => fn () => is_dir(storage_path('app')) && is_writable(storage_path('app')),
        ];

        $results = [];

        foreach ($checks as $name => $check) {
            try {
                $result = $check();
                $results[$name] = $result === false ? 'failed' : 'ok';
            } catch (Throwable) {
                $results[$name] = 'failed';
            }
        }

        $ready = ! in_array('failed', $results, true);

        return response()->json(
            ['status' => $ready ? 'ready' : 'unavailable', 'checks' => $results],
            $ready ? 200 : 503,
        );
    }
}
