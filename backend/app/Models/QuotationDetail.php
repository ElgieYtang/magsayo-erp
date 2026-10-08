<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QuotationDetail extends Model
{
    protected $table = 'quotation_details';

    public $timestamps = false;

    protected $fillable = [
        'quotation_id',
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

    public function quotation(): BelongsTo
    {
        return $this->belongsTo(Quotation::class, 'quotation_id');
    }
}
