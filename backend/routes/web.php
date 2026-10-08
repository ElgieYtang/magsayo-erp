<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'app' => config('app.name'),
        'message' => 'RTS ERP Laravel API. Use /api routes from the React frontend.',
    ]);
});
