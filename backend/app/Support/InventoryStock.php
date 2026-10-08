<?php

namespace App\Support;

use App\Models\InventoryMovement;
use Illuminate\Support\Facades\DB;

class InventoryStock
{
    /**
     * On-hand quantity per item_id (SUM(in) - SUM(out)).
     *
     * @return array<int, float>
     */
    public static function quantitiesByItemId(?int $branchId = null): array
    {
        $rows = InventoryMovement::query()
            ->select(
                'item_id',
                DB::raw('SUM(`in`) as qty_in'),
                DB::raw('SUM(`out`) as qty_out'),
            )
            ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
            ->where('item_id', '>', 0)
            ->groupBy('item_id')
            ->get();

        $levels = [];
        foreach ($rows as $row) {
            $levels[(int) $row->item_id] = (float) $row->qty_in - (float) $row->qty_out;
        }

        return $levels;
    }

    public static function quantityForItem(int $itemId, ?int $branchId = null): float
    {
        if ($itemId <= 0) {
            return 0.0;
        }

        $row = InventoryMovement::query()
            ->select(
                DB::raw('SUM(`in`) as qty_in'),
                DB::raw('SUM(`out`) as qty_out'),
            )
            ->when($branchId, fn ($query) => $query->where('branch_id', $branchId))
            ->where('item_id', $itemId)
            ->first();

        if (! $row) {
            return 0.0;
        }

        return (float) $row->qty_in - (float) $row->qty_out;
    }

    public static function statusLabel(float $quantity): string
    {
        if ($quantity <= 0) {
            return 'Out of Stock';
        }

        if ($quantity <= 5) {
            return 'Low Stock';
        }

        return 'In Stock';
    }
}
