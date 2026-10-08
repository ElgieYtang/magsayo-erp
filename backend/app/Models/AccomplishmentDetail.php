<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AccomplishmentDetail extends Model
{
    protected $table = 'accomplishment_details';

    public $timestamps = false;

    protected $fillable = [
        'accomplishment_id',
        'path_url',
    ];

    public function accomplishment(): BelongsTo
    {
        return $this->belongsTo(Accomplishment::class, 'accomplishment_id');
    }
}
