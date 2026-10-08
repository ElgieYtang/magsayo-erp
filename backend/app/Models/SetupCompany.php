<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SetupCompany extends Model
{
    protected $table = 'setup_company';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'address',
        'contact_no',
        'tin_no',
        'status',
    ];

    public function branches(): HasMany
    {
        return $this->hasMany(SetupBranch::class, 'company_id');
    }
}
