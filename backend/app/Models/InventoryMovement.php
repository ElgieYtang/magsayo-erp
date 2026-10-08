<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InventoryMovement extends Model
{
    protected $table = 'inventory';

    public $timestamps = false;

    protected $fillable = [
        'branch_id',
        'item_id',
        'trans_id',
        'trans_date',
        'trans_type',
        'in',
        'out',
    ];

    protected function casts(): array
    {
        return [
            'trans_date' => 'date',
            'in' => 'float',
            'out' => 'float',
        ];
    }
}
