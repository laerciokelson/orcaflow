<?php

use Illuminate\Support\Facades\Redis;

test('the liveness endpoint is available', function () {
    $this->get('/up')->assertOk();
});

test('the readiness endpoint checks required infrastructure', function () {
    Redis::set('health:test', 'ok');

    $this->get('/ready')
        ->assertOk()
        ->assertExactJson([
            'status' => 'ready',
            'checks' => [
                'database' => 'ok',
                'redis' => 'ok',
                'storage' => 'ok',
            ],
        ]);
});
