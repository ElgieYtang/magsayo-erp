<?php

use App\Http\Controllers\Api\SettingController;
use Illuminate\Support\Facades\Route;

Route::get('/settings', [SettingController::class, 'show']);
Route::put('/settings', [SettingController::class, 'update']);
Route::put('/settings/password', [SettingController::class, 'updatePassword']);
