<?php

namespace Database\Seeders;

use App\Models\SetupUser;
use App\Support\LegacyPassword;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = SetupUser::query()->where('username', 'admin')->first();

        if ($admin && LegacyPassword::needsRehash((string) $admin->password)) {
            $admin->forceFill([
                'password' => LegacyPassword::hash('p@ssw0rd'),
            ])->save();
        }
    }
}
