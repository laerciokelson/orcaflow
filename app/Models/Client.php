<?php

namespace App\Models;

use App\Enums\ClientStatus;
use App\Enums\ClientType;
use Database\Factories\ClientFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property ClientType $type
 * @property string|null $name
 * @property string|null $legal_name
 * @property string|null $tax_number
 * @property string|null $email
 * @property string|null $phone
 * @property string|null $mobile
 * @property string|null $billing_address
 * @property string|null $billing_postal_code
 * @property string|null $billing_city
 * @property string|null $billing_country
 * @property string|null $notes
 * @property ClientStatus $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
#[Fillable([
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
    'status',
])]
class Client extends Model
{
    /** @use HasFactory<ClientFactory> */
    use HasFactory;
    use SoftDeletes;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type'   => ClientType::class,
            'status' => ClientStatus::class,
        ];
    }
}
