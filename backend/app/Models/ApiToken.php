<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ApiToken extends Model
{
    protected $fillable = [
        'setup_user_id',
        'name',
        'token',
        'last_used_at',
        'expires_at',
    ];

    protected function casts(): array
    {
        return [
            'last_used_at' => 'datetime',
            'expires_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(SetupUser::class, 'setup_user_id');
    }

    public static function issueFor(SetupUser $user, string $name = 'web'): string
    {
        $plainTextToken = Str::random(64);

        static::create([
            'setup_user_id' => $user->id,
            'name' => $name,
            'token' => hash('sha256', $plainTextToken),
            'expires_at' => now()->addDays(30),
        ]);

        return $plainTextToken;
    }

    public static function findByPlainTextToken(string $plainTextToken): ?self
    {
        return static::query()
            ->where('token', hash('sha256', $plainTextToken))
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            })
            ->first();
    }
}
