<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ApiToken;
use App\Models\SetupUser;
use App\Support\LegacyPassword;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'login' => ['required', 'string', 'max:255'],
            'password' => ['required', 'string'],
        ]);

        $login = self::normalizeLogin($credentials['login']);

        $user = SetupUser::query()
            ->where('username', $login)
            ->first();

        if (! $user || ! $user->isActive() || ! LegacyPassword::verify($credentials['password'], (string) $user->password)) {
            return response()->json([
                'message' => 'Invalid username or password.',
            ], 422);
        }

        if (LegacyPassword::needsRehash((string) $user->password)) {
            $user->forceFill([
                'password' => LegacyPassword::hash($credentials['password']),
            ])->save();
        }

        $plainTextToken = ApiToken::issueFor($user);

        return response()->json([
            'token' => $plainTextToken,
            'token_type' => 'Bearer',
            'user' => $user->toAuthArray(),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->attributes->get('auth_user');

        return response()->json([
            'user' => $user->toAuthArray(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        /** @var ApiToken|null $token */
        $token = $request->attributes->get('auth_token');

        $token?->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }

    private static function normalizeLogin(string $login): string
    {
        $normalized = Str::lower(trim($login));

        return match ($normalized) {
            'admin', 'admin@responsivcode.com' => 'admin',
            default => trim($login),
        };
    }
}
