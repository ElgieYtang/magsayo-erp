<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SetupUnitMeasure extends Model
{
    protected $table = 'setup_unit_measure';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'status',
    ];
}
