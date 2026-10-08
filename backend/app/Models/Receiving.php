<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Receiving extends Model
{
    protected $table = 'receiving_main';

    public $timestamps = false;

    protected $fillable = [
        'po_id',
        'receiving_no',
        'receiving_date',
        'branch_id',
        'remarks',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'receiving_date' => 'date',
        ];
    }

    public function details(): HasMany
    {
        return $this->hasMany(ReceivingDetail::class, 'receiving_id');
    }

    public function purchaseOrder(): BelongsTo
    {
        return $this->belongsTo(PurchaseOrder::class, 'po_id');
    }
}
