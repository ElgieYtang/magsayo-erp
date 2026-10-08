<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SettingController;
use App\Http\Controllers\Api\Setup\BranchController;
use App\Http\Controllers\Api\Setup\BrandController;
use App\Http\Controllers\Api\Setup\CategoryController;
use App\Http\Controllers\Api\Setup\CompanyController;
use App\Http\Controllers\Api\Setup\CustomerController;
use App\Http\Controllers\Api\Setup\ItemController;
use App\Http\Controllers\Api\Setup\PositionController;
use App\Http\Controllers\Api\Setup\ProductModelController;
use App\Http\Controllers\Api\Setup\ProjectController;
use App\Http\Controllers\Api\Setup\SupplierController;
use App\Http\Controllers\Api\Setup\UnitOfMeasureController;
use App\Http\Controllers\Api\Setup\UserController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'app' => config('app.name'),
    ]);
});

Route::post('/login', [AuthController::class, 'login']);

Route::get('/settings', [SettingController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::put('/settings', [SettingController::class, 'update']);
    Route::put('/settings/password', [SettingController::class, 'updatePassword']);

    Route::prefix('setups')->group(function () {
        Route::get('companies', [CompanyController::class, 'index']);
        Route::post('companies', [CompanyController::class, 'store']);
        Route::get('companies/{company}', [CompanyController::class, 'show']);
        Route::put('companies/{company}', [CompanyController::class, 'update']);
        Route::post('companies/{company}/logo', [CompanyController::class, 'uploadLogo']);

        Route::apiResource('branches', BranchController::class);
        Route::apiResource('projects', ProjectController::class);
        Route::apiResource('positions', PositionController::class);
        Route::apiResource('categories', CategoryController::class);
        Route::apiResource('brands', BrandController::class);

        Route::get('models/brand/{brandId}', [ProductModelController::class, 'byBrand']);
        Route::apiResource('models', ProductModelController::class)
            ->parameters(['models' => 'model']);

        Route::apiResource('units', UnitOfMeasureController::class)
            ->parameters(['units' => 'unit']);

        Route::apiResource('items', ItemController::class);
        Route::apiResource('suppliers', SupplierController::class);
        Route::apiResource('customers', CustomerController::class);
        Route::apiResource('users', UserController::class);
    });
});
