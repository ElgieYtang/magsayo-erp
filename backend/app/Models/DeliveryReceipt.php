<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DeliveryReceipt extends Model
{
    protected $table = 'delivery_main';

    public $timestamps = false;

    protected $fillable = [
        'outslip_id',
        'dr_no',
        'dr_date',
        'customer_id',
        'customer_name',
        'dr_total',
        'prepared_by',
        'delivered_by',
        'status',
        'date_created',
    ];

    protected function casts(): array
    {
        return [
            'dr_date' => 'date',
            'dr_total' => 'float',
        ];
    }

    public function details(): HasMany
    {
        return $this->hasMany(DeliveryDetail::class, 'delivery_id');
    }

    public function outslip(): BelongsTo
    {
        return $this->belongsTo(Outslip::class, 'outslip_id');
    }
}
