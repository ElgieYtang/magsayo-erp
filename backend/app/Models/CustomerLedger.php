<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerLedger extends Model
{
    protected $table = 'customer_ledger';

    public $timestamps = false;

    protected $fillable = [
        'customer_id',
        'outslip_id',
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
