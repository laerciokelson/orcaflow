<?php

namespace App\Http\Requests;

use App\Models\Client;

class UpdateClientRequest extends StoreClientRequest
{
    public function authorize(): bool
    {
        $client = $this->route('client');

        return $client instanceof Client
            && $this->user()?->can('update', $client) === true;
    }
}
