<?php

namespace Database\Factories;

use App\Enums\ClientStatus;
use App\Enums\ClientType;
use App\Models\Client;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Client>
 */
class ClientFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type'                => ClientType::Individual,
            'name'                => fake()->name(),
            'legal_name'          => null,
            'tax_number'          => fake()->optional()->numerify('#########'),
            'email'               => fake()->optional()->safeEmail(),
            'phone'               => fake()->optional()->phoneNumber(),
            'mobile'              => fake()->optional()->phoneNumber(),
            'billing_address'     => fake()->optional()->streetAddress(),
            'billing_postal_code' => fake()->optional()->postcode(),
            'billing_city'        => fake()->optional()->city(),
            'billing_country'     => fake()->optional()->country(),
            'notes'               => fake()->optional()->sentence(),
            'status'              => ClientStatus::Active,
        ];
    }

    /**
     * Create an individual client state.
     */
    public function individual(): static
    {
        return $this->state(fn (array $attributes) => [
            'type'       => ClientType::Individual,
            'name'       => fake()->name(),
            'legal_name' => null,
        ]);
    }

    /**
     * Create a company client state.
     */
    public function company(): static
    {
        return $this->state(fn (array $attributes) => [
            'type'       => ClientType::Company,
            'name'       => fake()->optional()->company(),
            'legal_name' => fake()->company(),
        ]);
    }

    /**
     * Create an inactive client state.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => ClientStatus::Inactive,
        ]);
    }
}
