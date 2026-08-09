<?php

use App\Enums\ClientStatus;
use App\Enums\ClientType;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class () extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('clients', function (Blueprint $table) {
            $table->id();
            $table->string('type', 20)->index();
            $table->string('name')->nullable()->index();
            $table->string('legal_name')->nullable()->index();
            $table->string('tax_number', 32)->nullable()->index();
            $table->string('email')->nullable();
            $table->string('phone', 32)->nullable();
            $table->string('mobile', 32)->nullable();
            $table->text('billing_address')->nullable();
            $table->string('billing_postal_code', 32)->nullable();
            $table->string('billing_city')->nullable();
            $table->string('billing_country', 100)->nullable();
            $table->text('notes')->nullable();
            $table->string('status', 20)->index();
            $table->timestamps();
            $table->softDeletes();
        });

        $individual = ClientType::Individual->value;
        $company    = ClientType::Company->value;
        $active     = ClientStatus::Active->value;
        $inactive   = ClientStatus::Inactive->value;

        DB::statement("ALTER TABLE clients ADD CONSTRAINT clients_type_check CHECK (type IN ('{$individual}', '{$company}'))");
        DB::statement("ALTER TABLE clients ADD CONSTRAINT clients_status_check CHECK (status IN ('{$active}', '{$inactive}'))");
        DB::statement("ALTER TABLE clients ADD CONSTRAINT clients_required_names_check CHECK ((type = '{$individual}' AND NULLIF(TRIM(name), '') IS NOT NULL) OR (type = '{$company}' AND NULLIF(TRIM(legal_name), '') IS NOT NULL))");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clients');
    }
};
