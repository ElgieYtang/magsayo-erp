<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SupplierLedger extends Model
{
    protected $table = 'supplier_ledger';

    public $timestamps = false;

    protected $fillable = [
        'supplier_id',
        'po_id',
        'debit',
        'credit',
    ];

    protected function casts(): array
    {
        return [
            'debit' => 'float',
            'credit' => 'float',
        ];
    }
}
