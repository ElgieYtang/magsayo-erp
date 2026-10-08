<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SetupProject extends Model
{
    protected $table = 'setup_project';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'address',
        'status',
    ];
}
