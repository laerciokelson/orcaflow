<?php

use App\Enums\ClientStatus;
use App\Enums\ClientType;
use App\Models\Client;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

test('guests cannot access client management', function (string $method, string $route) {
    $client = Client::factory()->create();

    $response = match ($method) {
        'get'   => $this->get(route($route, $route === 'clients.index' || $route === 'clients.create' ? [] : $client)),
        'post'  => $this->post(route($route), []),
        'put'   => $this->put(route($route, $client), []),
        'patch' => $this->patch(route($route, $client)),
    };

    $response->assertRedirect(route('login'));
})->with([
    ['get', 'clients.index'],
    ['get', 'clients.create'],
    ['post', 'clients.store'],
    ['get', 'clients.show'],
    ['get', 'clients.edit'],
    ['put', 'clients.update'],
    ['patch', 'clients.update-status'],
]);

test('authenticated users can access the client list', function () {
    $this->actingAs(User::factory()->create())
        ->get(route('clients.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('clients/index')
            ->has('clients.data')
            ->where('filters.search', ''));
});

test('email verification is not required to manage clients', function () {
    $this->actingAs(User::factory()->unverified()->create())
        ->get(route('clients.index'))
        ->assertOk();
});

test('client list is paginated with twenty clients per page', function () {
    Client::factory()->count(21)->create();

    $this->actingAs(User::factory()->create())
        ->get(route('clients.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('clients.data', 20)
            ->where('clients.total', 21)
            ->where('clients.last_page', 2));
});

test('clients can be searched by supported identity fields', function (string $field, string $value, string $resultField) {
    $factory = $field === 'legal_name'
        ? Client::factory()->company()
        : Client::factory();

    $factory->create([
        $field => $value,
        ...($field === 'legal_name' ? ['name' => null] : []),
    ]);
    Client::factory()->create();

    $this->actingAs(User::factory()->create())
        ->get(route('clients.index', ['search' => $value]))
        ->assertInertia(fn (Assert $page) => $page
            ->has('clients.data', 1)
            ->where("clients.data.0.{$resultField}", $value)
            ->where('filters.search', $value));
})->with([
    'name'       => ['name', 'Cliente Encontrável', 'display_name'],
    'legal name' => ['legal_name', 'Empresa Pesquisável, Lda.', 'display_name'],
    'tax number' => ['tax_number', '001234567', 'tax_number'],
    'email'      => ['email', 'pesquisa@example.test', 'email'],
    'phone'      => ['phone', '210000111', 'phone'],
    'mobile'     => ['mobile', '910000222', 'mobile'],
]);

test('an individual client can be created and is active', function () {
    $response = $this->actingAs(User::factory()->create())->post(route('clients.store'), [
        'type'       => ClientType::Individual->value,
        'name'       => 'Ana Particular',
        'tax_number' => '012345678',
        'email'      => 'ana@example.test',
    ]);

    $client = Client::query()->where('email', 'ana@example.test')->firstOrFail();

    $response->assertRedirect(route('clients.show', $client));

    expect($client->status)->toBe(ClientStatus::Active)
        ->and($client->legal_name)->toBeNull()
        ->and($client->tax_number)->toBe('012345678');
});

test('a company client can be created without a commercial name', function () {
    $this->actingAs(User::factory()->create())->post(route('clients.store'), [
        'type'       => ClientType::Company->value,
        'legal_name' => 'Empresa Técnica, Lda.',
        'name'       => '',
    ])->assertSessionHasNoErrors();

    $this->assertDatabaseHas('clients', [
        'type'       => ClientType::Company->value,
        'legal_name' => 'Empresa Técnica, Lda.',
        'name'       => null,
        'status'     => ClientStatus::Active->value,
    ]);
});

test('individual clients require a name', function () {
    $this->actingAs(User::factory()->create())->post(route('clients.store'), [
        'type' => ClientType::Individual->value,
        'name' => '',
    ])->assertInvalid(['name']);
});

test('company clients require a legal name', function () {
    $this->actingAs(User::factory()->create())->post(route('clients.store'), [
        'type'       => ClientType::Company->value,
        'legal_name' => '',
        'name'       => 'Nome comercial',
    ])->assertInvalid(['legal_name']);
});

test('required client names cannot contain only whitespace', function (string $type, string $field) {
    $this->actingAs(User::factory()->create())->post(route('clients.store'), [
        'type' => $type,
        $field => '   ',
    ])->assertInvalid([$field]);
})->with([
    'individual name'    => [ClientType::Individual->value, 'name'],
    'company legal name' => [ClientType::Company->value, 'legal_name'],
]);

test('a client can be viewed and edited', function () {
    $client = Client::factory()->create(['name' => 'Nome original']);
    $user   = User::factory()->create();

    $this->actingAs($user)
        ->get(route('clients.show', $client))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('clients/show')
            ->where('client.display_name', 'Nome original'));

    $this->actingAs($user)->put(route('clients.update', $client), [
        'type'   => ClientType::Individual->value,
        'name'   => 'Nome atualizado',
        'mobile' => '912345678',
    ])->assertRedirect(route('clients.show', $client));

    $this->assertDatabaseHas('clients', [
        'id'     => $client->id,
        'name'   => 'Nome atualizado',
        'mobile' => '912345678',
    ]);
});

test('changing a client to individual clears its legal name', function () {
    $client = Client::factory()->company()->create();

    $this->actingAs(User::factory()->create())->put(route('clients.update', $client), [
        'type' => ClientType::Individual->value,
        'name' => 'Novo particular',
    ])->assertSessionHasNoErrors();

    expect($client->refresh()->type)->toBe(ClientType::Individual)
        ->and($client->legal_name)->toBeNull();
});

test('a client can be explicitly deactivated without being deleted', function () {
    $client = Client::factory()->create();
    $user   = User::factory()->create();

    $this->actingAs($user)
        ->patch(route('clients.update-status', $client), ['status' => ClientStatus::Inactive->value])
        ->assertRedirect();

    expect($client->refresh()->status)->toBe(ClientStatus::Inactive)
        ->and($client->deleted_at)->toBeNull();
});

test('a client can be explicitly activated', function () {
    $client = Client::factory()->inactive()->create();

    $this->actingAs(User::factory()->create())
        ->patch(route('clients.update-status', $client), ['status' => ClientStatus::Active->value])
        ->assertRedirect();

    expect($client->refresh()->status)->toBe(ClientStatus::Active);
});

test('updating a client status is idempotent', function () {
    $client = Client::factory()->create();

    $this->actingAs(User::factory()->create())
        ->patch(route('clients.update-status', $client), ['status' => ClientStatus::Active->value])
        ->assertRedirect();

    expect($client->refresh()->status)->toBe(ClientStatus::Active);
});

test('client forms cannot set the status directly', function () {
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('clients.store'), [
        'type'   => ClientType::Individual->value,
        'name'   => 'Cliente protegido',
        'status' => ClientStatus::Inactive->value,
    ])->assertSessionHasNoErrors();

    $client = Client::query()->where('name', 'Cliente protegido')->firstOrFail();

    expect($client->status)->toBe(ClientStatus::Active);

    $this->actingAs($user)->put(route('clients.update', $client), [
        'type'   => ClientType::Individual->value,
        'name'   => 'Cliente protegido atualizado',
        'status' => ClientStatus::Inactive->value,
    ])->assertSessionHasNoErrors();

    expect($client->refresh()->status)->toBe(ClientStatus::Active);
});

test('client pagination uses Portuguese labels', function () {
    Client::factory()->count(21)->create();

    $this->actingAs(User::factory()->create())
        ->get(route('clients.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('clients.links.0.label', '‹ Anterior')
            ->where('clients.links.3.label', 'Seguinte ›'));
});

test('the client policy authorizes authenticated management', function () {
    $user   = User::factory()->create();
    $client = Client::factory()->create();

    expect(Gate::forUser($user)->allows('viewAny', Client::class))->toBeTrue()
        ->and(Gate::forUser($user)->allows('view', $client))->toBeTrue()
        ->and(Gate::forUser($user)->allows('create', Client::class))->toBeTrue()
        ->and(Gate::forUser($user)->allows('update', $client))->toBeTrue();
});
