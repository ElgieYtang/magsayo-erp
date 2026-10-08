<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SetupModel extends Model
{
    protected $table = 'setup_model';

    public $timestamps = false;

    protected $fillable = [
        'brand_id',
        'name',
        'status',
    ];

    public function brand(): BelongsTo
    {
        return $this->belongsTo(SetupBrand::class, 'brand_id');
    }
}
