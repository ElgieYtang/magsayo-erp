<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PurchaseOrder extends Model
{
    protected $table = 'purchase_main';

    public $timestamps = false;

    protected $fillable = [
        'quotation_id',
        'supplier_id',
        'supplier_name',
        'po_no',
        'po_date',
        'po_total',
        'prepared_by',
        'approved_by',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'po_date' => 'date',
            'po_total' => 'float',
        ];
    }

    public function details(): HasMany
    {
        return $this->hasMany(PurchaseDetail::class, 'po_id');
    }

    public function receivings(): HasMany
    {
        return $this->hasMany(Receiving::class, 'po_id');
    }
}
