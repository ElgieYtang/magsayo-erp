<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('purchase_main') && ! Schema::hasColumn('purchase_main', 'quotation_id')) {
            Schema::table('purchase_main', function (Blueprint $table) {
                $table->unsignedInteger('quotation_id')->default(0)->after('id');
            });
        }

        if (Schema::hasTable('receiving_main') && ! Schema::hasColumn('receiving_main', 'po_id')) {
            Schema::table('receiving_main', function (Blueprint $table) {
                $table->unsignedInteger('po_id')->default(0)->after('id');
            });
        }

        if (Schema::hasTable('inventory') && ! Schema::hasColumn('inventory', 'item_id')) {
            Schema::table('inventory', function (Blueprint $table) {
                $table->unsignedInteger('item_id')->default(0)->after('branch_id');
            });
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('purchase_main') && Schema::hasColumn('purchase_main', 'quotation_id')) {
            Schema::table('purchase_main', function (Blueprint $table) {
                $table->dropColumn('quotation_id');
            });
        }

        if (Schema::hasTable('receiving_main') && Schema::hasColumn('receiving_main', 'po_id')) {
            Schema::table('receiving_main', function (Blueprint $table) {
                $table->dropColumn('po_id');
            });
        }

        if (Schema::hasTable('inventory') && Schema::hasColumn('inventory', 'item_id')) {
            Schema::table('inventory', function (Blueprint $table) {
                $table->dropColumn('item_id');
            });
        }
    }
};
