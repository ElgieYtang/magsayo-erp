<?php

namespace App\Console\Commands;

use App\Models\SetupUser;
use App\Support\LegacyPassword;
use Illuminate\Console\Command;

class HashLegacyPasswords extends Command
{
    protected $signature = 'erp:hash-passwords';

    protected $description = 'Hash any legacy plaintext passwords in setup_users';

    public function handle(): int
    {
        $updated = 0;

        SetupUser::query()->each(function (SetupUser $user) use (&$updated) {
            if (! LegacyPassword::needsRehash((string) $user->password)) {
                return;
            }

            $user->forceFill([
                'password' => LegacyPassword::hash((string) $user->password),
            ])->save();

            $updated++;
            $this->line("Hashed password for {$user->username}");
        });

        $this->info("Updated {$updated} user(s).");

        return self::SUCCESS;
    }
}
