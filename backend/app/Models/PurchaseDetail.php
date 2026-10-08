<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseDetail extends Model
{
    protected $table = 'purchase_details';

    public $timestamps = false;

    protected $fillable = [
        'po_id',
        'item_id',
        'item_name',
        'qty',
        'price',
        'amount',
    ];

    protected function casts(): array
    {
        return [
            'qty' => 'float',
            'price' => 'float',
            'amount' => 'float',
        ];
    }

    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class, 'po_id');
    }
}
