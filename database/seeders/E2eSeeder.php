<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use RuntimeException;

class E2eSeeder extends Seeder
{
    public function run(): void
    {
        $database = (string) config('database.connections.mysql.database');

        if (! app()->environment('e2e') || ! Str::endsWith($database, '_test')) {
            throw new RuntimeException('E2E data may only be seeded in the isolated E2E database.');
        }

        User::factory()->create([
            'name'              => 'OrçaFlow E2E',
            'email'             => 'e2e@orcaflow.test',
            'email_verified_at' => now(),
            'password'          => 'password',
        ]);
    }
}
