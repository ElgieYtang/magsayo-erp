<?php

namespace App\Support;

use Illuminate\Support\Facades\Hash;

class LegacyPassword
{
    public static function verify(string $plainText, string $stored): bool
    {
        if ($stored === '') {
            return false;
        }

        if (self::looksHashed($stored) && Hash::check($plainText, $stored)) {
            return true;
        }

        return hash_equals($stored, $plainText);
    }

    public static function hash(string $plainText): string
    {
        return Hash::make($plainText);
    }

    public static function needsRehash(string $stored): bool
    {
        return ! self::looksHashed($stored);
    }

    private static function looksHashed(string $stored): bool
    {
        return str_starts_with($stored, '$2y$')
            || str_starts_with($stored, '$2a$')
            || str_starts_with($stored, '$argon2');
    }
}
