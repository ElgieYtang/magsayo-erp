<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Accomplishment extends Model
{
    protected $table = 'accomplishment_main';

    public $timestamps = false;

    protected $fillable = [
        'accomplishment_no',
        'accomplishment_date',
        'project_id',
        'remarks',
        'prepared_by',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'accomplishment_date' => 'date',
        ];
    }

    public function details(): HasMany
    {
        return $this->hasMany(AccomplishmentDetail::class, 'accomplishment_id');
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(SetupProject::class, 'project_id');
    }

    public function preparer(): BelongsTo
    {
        return $this->belongsTo(SetupUser::class, 'prepared_by');
    }
}
