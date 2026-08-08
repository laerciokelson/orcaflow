<?php

use App\Enums\ClientStatus;
use App\Enums\ClientType;
use App\Models\Client;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('creates an individual client and persists its main fields', function () {
    $client = Client::query()->create([
        'type'                => ClientType::Individual,
        'name'                => 'Ana Silva',
        'legal_name'          => null,
        'tax_number'          => '012345678',
        'email'               => 'ana@example.test',
        'phone'               => '211234567',
        'mobile'              => '912345678',
        'billing_address'     => 'Rua do Mercado, 10',
        'billing_postal_code' => '1000-001',
        'billing_city'        => 'Lisboa',
        'billing_country'     => 'Portugal',
        'notes'               => 'Cliente particular.',
        'status'              => ClientStatus::Active,
    ]);

    expect($client->type)->toBe(ClientType::Individual)
        ->and($client->status)->toBe(ClientStatus::Active)
        ->and($client->tax_number)->toBe('012345678');

    $this->assertDatabaseHas('clients', [
        'id'                  => $client->id,
        'type'                => ClientType::Individual->value,
        'name'                => 'Ana Silva',
        'legal_name'          => null,
        'tax_number'          => '012345678',
        'email'               => 'ana@example.test',
        'phone'               => '211234567',
        'mobile'              => '912345678',
        'billing_address'     => 'Rua do Mercado, 10',
        'billing_postal_code' => '1000-001',
        'billing_city'        => 'Lisboa',
        'billing_country'     => 'Portugal',
        'notes'               => 'Cliente particular.',
        'status'              => ClientStatus::Active->value,
    ]);
});

it('creates a company client without a commercial name', function () {
    $client = Client::query()->create([
        'type'       => ClientType::Company,
        'name'       => null,
        'legal_name' => 'Oficina Técnica de Lisboa, Lda.',
        'tax_number' => '500000000',
        'status'     => ClientStatus::Inactive,
    ]);

    expect($client->type)->toBe(ClientType::Company)
        ->and($client->name)->toBeNull()
        ->and($client->legal_name)->toBe('Oficina Técnica de Lisboa, Lda.')
        ->and($client->status)->toBe(ClientStatus::Inactive);
});

it('casts type and status to enums after loading from the database', function () {
    $client    = Client::factory()->company()->inactive()->create();
    $persisted = Client::query()->findOrFail($client->id);

    expect($persisted->type)->toBe(ClientType::Company)
        ->and($persisted->status)->toBe(ClientStatus::Inactive);
});

it('soft deletes clients', function () {
    $client = Client::factory()->create();

    $client->delete();

    $this->assertSoftDeleted($client);

    expect(fn () => Client::query()->findOrFail($client->id))
        ->toThrow(ModelNotFoundException::class)
        ->and(Client::withTrashed()->find($client->id))
        ->not->toBeNull();
});

it('creates valid clients through each factory state', function () {
    $individual = Client::factory()->individual()->create();
    $company    = Client::factory()->company()->create();
    $inactive   = Client::factory()->inactive()->create();

    expect($individual->type)->toBe(ClientType::Individual)
        ->and($individual->name)->not->toBeEmpty()
        ->and($individual->legal_name)->toBeNull()
        ->and($company->type)->toBe(ClientType::Company)
        ->and($company->legal_name)->not->toBeEmpty()
        ->and($inactive->status)->toBe(ClientStatus::Inactive);
});

it('requires a name for individual clients', function () {
    Client::query()->create([
        'type'   => ClientType::Individual,
        'name'   => null,
        'status' => ClientStatus::Active,
    ]);
})->throws(QueryException::class);

it('requires a legal name for company clients', function () {
    Client::query()->create([
        'type'       => ClientType::Company,
        'name'       => 'Nome comercial',
        'legal_name' => null,
        'status'     => ClientStatus::Active,
    ]);
})->throws(QueryException::class);
