<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class ResetTransactions extends Command
{
    protected $signature = 'erp:reset-transactions {--force : Skip confirmation prompt}';

    protected $description = 'Delete all transaction data (quotations through accomplishments) while keeping setup/master data';

    /** @var list<string> */
    private const TABLES = [
        'billing_payments',
        'billing',
        'customer_ledger',
        'delivery_details',
        'delivery_main',
        'gate_pass_main',
        'outslip_details',
        'outslip_main',
        'inventory',
        'receiving_details',
        'receiving_main',
        'purchase_details',
        'purchase_main',
        'supplier_ledger',
        'quotation_details',
        'quotation_main',
        'accomplishment_details',
        'accomplishment_main',
    ];

    public function handle(): int
    {
        if (! $this->option('force') && ! $this->confirm('This will permanently delete ALL transaction records. Continue?')) {
            $this->warn('Cancelled.');

            return self::SUCCESS;
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=0');

        foreach (self::TABLES as $table) {
            DB::statement("TRUNCATE TABLE `{$table}`");
            $this->line("Truncated {$table}");
        }

        DB::statement('SET FOREIGN_KEY_CHECKS=1');

        $photoDir = storage_path('app/public/accomplishments');
        if (File::isDirectory($photoDir)) {
            File::cleanDirectory($photoDir);
            $this->line('Cleared accomplishment photos');
        }

        $this->info('All transaction test data has been removed. Setup/master data was kept.');

        return self::SUCCESS;
    }
}
