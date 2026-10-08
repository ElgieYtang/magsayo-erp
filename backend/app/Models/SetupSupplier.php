<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SetupSupplier extends Model
{
    protected $table = 'setup_supplier';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'address',
        'tin_no',
        'contact_person',
        'contact_person_no',
        'status',
    ];
}
