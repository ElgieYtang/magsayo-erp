<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('outslip_main')) {
            Schema::create('outslip_main', function (Blueprint $table) {
                $table->increments('id');
                $table->unsignedInteger('customer_id')->default(0);
                $table->string('customer_name')->nullable();
                $table->string('outslip_no')->nullable();
                $table->date('outslip_date')->nullable();
                $table->unsignedInteger('receiving_id')->default(0);
                $table->unsignedInteger('branch_id')->default(1);
                $table->unsignedInteger('prepared_by')->default(0);
                $table->string('status', 30)->default('PENDING');
                $table->timestamp('date_created')->nullable();
            });
        }

        if (! Schema::hasTable('outslip_details')) {
            Schema::create('outslip_details', function (Blueprint $table) {
                $table->increments('id');
                $table->unsignedInteger('outslip_id')->default(0);
                $table->unsignedInteger('item_id')->default(0);
                $table->text('item_name')->nullable();
                $table->double('qty')->default(0);
                $table->double('price')->default(0);
                $table->double('amount')->default(0);
                $table->timestamp('date_created')->nullable();
            });
        }

        if (Schema::hasTable('delivery_main') && ! Schema::hasColumn('delivery_main', 'outslip_id')) {
            Schema::table('delivery_main', function (Blueprint $table) {
                $table->unsignedInteger('outslip_id')->default(0)->after('id');
            });
        }

        if (Schema::hasTable('billing') && ! Schema::hasColumn('billing', 'paid_amount')) {
            Schema::table('billing', function (Blueprint $table) {
                $table->double('paid_amount')->default(0)->after('billing_total');
            });
        }

        if (! Schema::hasTable('billing_payments')) {
            Schema::create('billing_payments', function (Blueprint $table) {
                $table->increments('id');
                $table->unsignedInteger('billing_id')->default(0);
                $table->string('payment_no')->nullable();
                $table->date('payment_date')->nullable();
                $table->double('amount')->default(0);
                $table->string('reference')->nullable();
                $table->text('remarks')->nullable();
                $table->timestamp('date_created')->nullable();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('billing_payments');
        Schema::dropIfExists('outslip_details');
        Schema::dropIfExists('outslip_main');

        if (Schema::hasTable('delivery_main') && Schema::hasColumn('delivery_main', 'outslip_id')) {
            Schema::table('delivery_main', function (Blueprint $table) {
                $table->dropColumn('outslip_id');
            });
        }

        if (Schema::hasTable('billing') && Schema::hasColumn('billing', 'paid_amount')) {
            Schema::table('billing', function (Blueprint $table) {
                $table->dropColumn('paid_amount');
            });
        }
    }
};
