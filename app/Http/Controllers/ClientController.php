<?php

namespace App\Http\Controllers;

use App\Enums\ClientStatus;
use App\Enums\ClientType;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Requests\UpdateClientStatusRequest;
use App\Models\Client;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Client::class);

        $search = trim($request->string('search')->toString());

        $clients = Client::query()
            ->select(['id', 'type', 'name', 'legal_name', 'tax_number', 'email', 'phone', 'mobile', 'status'])
            ->when($search !== '', function (Builder $query) use ($search) {
                $query->where(function (Builder $query) use ($search) {
                    foreach (['name', 'legal_name', 'tax_number', 'email', 'phone', 'mobile'] as $column) {
                        $query->orWhere($column, 'like', "%{$search}%");
                    }
                });
            })
            ->orderByRaw('COALESCE(NULLIF(name, ?), legal_name)', [''])
            ->orderBy('id')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (Client $client) => $this->summary($client));

        return Inertia::render('clients/index', [
            'clients' => $clients,
            'filters' => ['search' => $search],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Client::class);

        return Inertia::render('clients/create', [
            'types' => $this->types(),
        ]);
    }

    public function store(StoreClientRequest $request): RedirectResponse
    {
        $client = Client::query()->create([
            ...$this->attributes($request->validated()),
            'status' => ClientStatus::Active,
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Cliente criado com sucesso.']);

        return to_route('clients.show', $client);
    }

    public function show(Client $client): Response
    {
        Gate::authorize('view', $client);

        return Inertia::render('clients/show', [
            'client' => $this->details($client),
        ]);
    }

    public function edit(Client $client): Response
    {
        Gate::authorize('update', $client);

        return Inertia::render('clients/edit', [
            'client' => $this->details($client),
            'types'  => $this->types(),
        ]);
    }

    public function update(UpdateClientRequest $request, Client $client): RedirectResponse
    {
        $client->update($this->attributes($request->validated()));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Cliente atualizado com sucesso.']);

        return to_route('clients.show', $client);
    }

    public function updateStatus(UpdateClientStatusRequest $request, Client $client): RedirectResponse
    {
        $status = ClientStatus::from((string) $request->validated('status'));

        $client->update(['status' => $status]);

        $message = $status === ClientStatus::Active
            ? 'Cliente ativado com sucesso.'
            : 'Cliente desativado com sucesso.';

        Inertia::flash('toast', ['type' => 'success', 'message' => $message]);

        return back();
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function attributes(array $validated): array
    {
        $attributes = Arr::only($validated, [
            'type',
            'name',
            'legal_name',
            'tax_number',
            'email',
            'phone',
            'mobile',
            'billing_address',
            'billing_postal_code',
            'billing_city',
            'billing_country',
            'notes',
        ]);

        if ($validated['type'] === ClientType::Individual->value) {
            $attributes['legal_name'] = null;
        }

        return $attributes;
    }

    /**
     * @return array{id: int, display_name: string, type: string, tax_number: string|null, email: string|null, phone: string|null, mobile: string|null, status: string}
     */
    private function summary(Client $client): array
    {
        return [
            'id'           => $client->id,
            'display_name' => $client->name ?: (string) $client->legal_name,
            'type'         => $client->type->value,
            'tax_number'   => $client->tax_number,
            'email'        => $client->email,
            'phone'        => $client->phone,
            'mobile'       => $client->mobile,
            'status'       => $client->status->value,
        ];
    }

    /**
     * @return array<string, int|string|null>
     */
    private function details(Client $client): array
    {
        return [
            ...$this->summary($client),
            'name'                => $client->name,
            'legal_name'          => $client->legal_name,
            'billing_address'     => $client->billing_address,
            'billing_postal_code' => $client->billing_postal_code,
            'billing_city'        => $client->billing_city,
            'billing_country'     => $client->billing_country,
            'notes'               => $client->notes,
        ];
    }

    /**
     * @return list<array{value: string, label: string}>
     */
    private function types(): array
    {
        return [
            ['value' => ClientType::Individual->value, 'label' => 'Particular'],
            ['value' => ClientType::Company->value, 'label' => 'Empresa'],
        ];
    }
}
