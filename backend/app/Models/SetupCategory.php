<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SetupCategory extends Model
{
    protected $table = 'setup_category';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'status',
    ];
}
