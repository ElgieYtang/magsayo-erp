<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DeliveryDetail extends Model
{
    protected $table = 'delivery_details';

    public $timestamps = false;

    protected $fillable = [
        'delivery_id',
        'item_id',
        'item_name',
        'qty',
        'price',
        'amount',
        'serial_no',
        'date_created',
    ];

    protected function casts(): array
    {
        return [
            'qty' => 'float',
            'price' => 'float',
            'amount' => 'float',
        ];
    }

    public function delivery(): BelongsTo
    {
        return $this->belongsTo(DeliveryReceipt::class, 'delivery_id');
    }
}
