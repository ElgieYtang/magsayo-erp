<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class HealthController extends Controller
{
    public function show(): JsonResponse
    {
        $database = 'ok';

        try {
            DB::connection()->getPdo();
            DB::select('select 1');
        } catch (\Throwable $exception) {
            $database = 'error';
        }

        return response()->json([
            'status' => $database === 'ok' ? 'ok' : 'degraded',
            'app' => config('app.name'),
            'version' => '0.2.0',
            'phase' => 8,
            'database' => $database,
        ]);
    }
}
