<?php

namespace App\Http\Requests;

use App\Enums\ClientType;
use App\Models\Client;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreClientRequest extends FormRequest
{
    protected function prepareForValidation(): void
    {
        foreach (['name', 'legal_name'] as $field) {
            if (! $this->exists($field) || ! is_string($this->input($field))) {
                continue;
            }

            $value = trim($this->string($field)->toString());

            $this->merge([$field => $value === '' ? null : $value]);
        }
    }

    public function authorize(): bool
    {
        return $this->user()?->can('create', Client::class) === true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return $this->clientRules();
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function clientRules(): array
    {
        return [
            'type'                => ['required', Rule::enum(ClientType::class)],
            'name'                => ['nullable', 'string', 'max:255', Rule::requiredIf($this->input('type') === ClientType::Individual->value)],
            'legal_name'          => ['nullable', 'string', 'max:255', Rule::requiredIf($this->input('type') === ClientType::Company->value)],
            'tax_number'          => ['nullable', 'string', 'max:32'],
            'email'               => ['nullable', 'email', 'max:255'],
            'phone'               => ['nullable', 'string', 'max:32'],
            'mobile'              => ['nullable', 'string', 'max:32'],
            'billing_address'     => ['nullable', 'string'],
            'billing_postal_code' => ['nullable', 'string', 'max:32'],
            'billing_city'        => ['nullable', 'string', 'max:255'],
            'billing_country'     => ['nullable', 'string', 'max:100'],
            'notes'               => ['nullable', 'string'],
        ];
    }
}
