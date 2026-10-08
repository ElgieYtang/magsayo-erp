<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GatePass extends Model
{
    protected $table = 'gate_pass_main';

    public $timestamps = false;

    protected $fillable = [
        'outslip_id',
        'gate_pass_no',
        'vehicle_no',
        'driver_name',
        'plate_no',
        'destination',
        'remarks',
        'status',
        'exit_at',
        'prepared_by',
        'date_created',
    ];

    protected function casts(): array
    {
        return [
            'exit_at' => 'datetime',
        ];
    }

    public function outslip(): BelongsTo
    {
        return $this->belongsTo(Outslip::class, 'outslip_id');
    }
}
