<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OutslipDetail extends Model
{
    protected $table = 'outslip_details';

    public $timestamps = false;

    protected $fillable = [
        'outslip_id',
        'item_id',
        'item_name',
        'qty',
        'price',
        'amount',
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

    public function outslip(): BelongsTo
    {
        return $this->belongsTo(Outslip::class, 'outslip_id');
    }
}
