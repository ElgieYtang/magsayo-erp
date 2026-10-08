<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SetupPosition extends Model
{
    protected $table = 'setup_position';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'status',
    ];
}
