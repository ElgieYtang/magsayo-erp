<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SetupBrand extends Model
{
    protected $table = 'setup_brand';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'status',
    ];

    public function models(): HasMany
    {
        return $this->hasMany(SetupModel::class, 'brand_id');
    }
}
