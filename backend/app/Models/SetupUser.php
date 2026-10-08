<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

class SetupUser extends Authenticatable
{
    protected $table = 'setup_users';

    public $timestamps = false;

    protected $fillable = [
        'username',
        'password',
        'name',
        'position_id',
        'type',
        'status',
    ];

    protected $hidden = [
        'password',
    ];

    public function apiTokens(): HasMany
    {
        return $this->hasMany(ApiToken::class, 'setup_user_id');
    }

    public function isActive(): bool
    {
        return strtoupper((string) $this->status) === 'ACTIVE';
    }

    public function isAdmin(): bool
    {
        return strtoupper((string) $this->type) === 'ADMIN';
    }

    public function toAuthArray(): array
    {
        return [
            'id' => $this->id,
            'username' => $this->username,
            'name' => $this->name,
            'email' => $this->username.'@responsivcode.local',
            'type' => $this->type,
            'role' => $this->isAdmin() ? 'admin' : 'staff',
            'position_id' => $this->position_id,
        ];
    }
}
