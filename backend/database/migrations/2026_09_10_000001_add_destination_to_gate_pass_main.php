<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('gate_pass_main')) {
            return;
        }

        Schema::table('gate_pass_main', function (Blueprint $table) {
            if (! Schema::hasColumn('gate_pass_main', 'destination')) {
                $table->string('destination')->nullable()->after('plate_no');
            }
        });
    }

    public function down(): void
    {
        if (! Schema::hasTable('gate_pass_main')) {
            return;
        }

        Schema::table('gate_pass_main', function (Blueprint $table) {
            if (Schema::hasColumn('gate_pass_main', 'destination')) {
                $table->dropColumn('destination');
            }
        });
    }
};
