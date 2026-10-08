<?php

namespace Database\Seeders;

use App\Models\Customer;
use App\Models\Item;
use App\Models\Supplier;
use Illuminate\Database\Seeder;

class RenumberSetupCodesSeeder extends Seeder
{
    public function run(): void
    {
        $this->renumber(Item::query()->orderBy('id')->get(), 'item_code', 'ITM-', 4);
        $this->renumber(Customer::query()->orderBy('id')->get(), 'code', 'CUST-', 3);
        $this->renumber(Supplier::query()->orderBy('id')->get(), 'code', 'SUP-', 3);
    }

    /**
     * @param  \Illuminate\Support\Collection<int, \Illuminate\Database\Eloquent\Model>  $rows
     */
    protected function renumber($rows, string $column, string $prefix, int $pad): void
    {
        foreach ($rows->values() as $index => $row) {
            $row->update([$column => $prefix.'TMP-'.($index + 1)]);
        }

        foreach ($rows->values() as $index => $row) {
            $row->refresh();
            $row->update([
                $column => $prefix.str_pad((string) ($index + 1), $pad, '0', STR_PAD_LEFT),
            ]);
        }
    }
}
