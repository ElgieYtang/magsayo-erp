<?php

namespace App\Support;

class DocumentNumber
{
    public static function next(string $prefix, ?string $latestNumber, int $pad = 5): string
    {
        $next = 1;

        if ($latestNumber && preg_match('/(\d+)$/', $latestNumber, $matches)) {
            $next = ((int) $matches[1]) + 1;
        }

        return $prefix.str_pad((string) $next, $pad, '0', STR_PAD_LEFT);
    }
}
