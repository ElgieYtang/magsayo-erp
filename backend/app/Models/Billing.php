<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Billing extends Model
{
    protected $table = 'billing';

    public $timestamps = false;

    protected $fillable = [
        'delivery_id',
        'billing_no',
        'billing_date',
        'customer_id',
        'customer_name',
        'billing_total',
        'paid_amount',
        'prepared_by',
        'status',
        'date_created',
    ];

    protected function casts(): array
    {
        return [
            'billing_date' => 'date',
            'billing_total' => 'float',
            'paid_amount' => 'float',
        ];
    }

    public function payments(): HasMany
    {
        return $this->hasMany(BillingPayment::class, 'billing_id');
    }

    public function delivery(): BelongsTo
    {
        return $this->belongsTo(DeliveryReceipt::class, 'delivery_id');
    }
}
