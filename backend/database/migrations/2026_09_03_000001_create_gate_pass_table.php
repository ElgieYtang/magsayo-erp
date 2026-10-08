<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('gate_pass_main')) {
            return;
        }

        Schema::create('gate_pass_main', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('outslip_id');
            $table->string('gate_pass_no', 255)->nullable();
            $table->string('vehicle_no', 255)->nullable();
            $table->string('driver_name', 255)->nullable();
            $table->string('plate_no', 255)->nullable();
            $table->text('remarks')->nullable();
            $table->string('status', 20)->default('PENDING');
            $table->dateTime('exit_at')->nullable();
            $table->unsignedInteger('prepared_by')->default(0);
            $table->timestamp('date_created')->useCurrent();
            $table->unique('outslip_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gate_pass_main');
    }
};
