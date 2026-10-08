<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BillingPayment extends Model
{
    protected $table = 'billing_payments';

    public $timestamps = false;

    protected $fillable = [
        'billing_id',
        'payment_no',
        'payment_date',
        'amount',
        'reference',
        'remarks',
        'date_created',
    ];

    protected function casts(): array
    {
        return [
            'payment_date' => 'date',
            'amount' => 'float',
        ];
    }

    public function billing(): BelongsTo
    {
        return $this->belongsTo(Billing::class, 'billing_id');
    }
}
