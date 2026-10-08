<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReceivingDetail extends Model
{
    protected $table = 'receiving_details';

    public $timestamps = false;

    protected $fillable = [
        'receiving_id',
        'item_id',
        'qty',
    ];

    protected function casts(): array
    {
        return [
            'qty' => 'float',
        ];
    }

    public function receiving(): BelongsTo
    {
        return $this->belongsTo(Receiving::class, 'receiving_id');
    }
}
