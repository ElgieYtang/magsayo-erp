<?php

namespace App\Http\Middleware;

use App\Models\ApiToken;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AuthenticateApiToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $plainTextToken = $request->bearerToken();

        if (! $plainTextToken) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $token = ApiToken::findByPlainTextToken($plainTextToken);

        if (! $token) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $user = $token->user;

        if (! $user || ! $user->isActive()) {
            return response()->json([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        $token->forceFill(['last_used_at' => now()])->save();

        $request->attributes->set('auth_user', $user);
        $request->attributes->set('auth_token', $token);

        return $next($request);
    }
}
