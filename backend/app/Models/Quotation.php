<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Quotation extends Model
{
    protected $table = 'quotation_main';

    public $timestamps = false;

    protected $fillable = [
        'customer_id',
        'customer_name',
        'quotation_no',
        'quotation_date',
        'quotation_total',
        'prepared_by',
        'approved_by',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'quotation_date' => 'date',
            'quotation_total' => 'float',
        ];
    }

    public function details(): HasMany
    {
        return $this->hasMany(QuotationDetail::class, 'quotation_id');
    }
}
