<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SetupBranch extends Model
{
    protected $table = 'setup_branch';

    public $timestamps = false;

    protected $fillable = [
        'company_id',
        'name',
        'status',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(SetupCompany::class, 'company_id');
    }
}
