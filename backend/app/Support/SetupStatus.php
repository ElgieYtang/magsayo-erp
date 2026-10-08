<?php

namespace App\Support;

class SetupStatus
{
    public static function toDb(?string $status): string
    {
        return strtoupper($status ?? '') === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE';
    }

    public static function toFrontend(?string $status): string
    {
        return strtoupper($status ?? '') === 'INACTIVE' ? 'Inactive' : 'Active';
    }
}
