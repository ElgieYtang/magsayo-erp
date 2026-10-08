<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SetupCustomer extends Model
{
    protected $table = 'setup_customer';

    public $timestamps = false;

    protected $fillable = [
        'name',
        'address',
        'tin_no',
        'terms',
        'terms_type',
        'status',
    ];
}
