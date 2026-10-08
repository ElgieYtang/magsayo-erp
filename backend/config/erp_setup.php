<?php

use App\Models\SetupBranch;
use App\Models\SetupBrand;
use App\Models\SetupCategory;
use App\Models\SetupCompany;
use App\Models\SetupCustomer;
use App\Models\SetupItem;
use App\Models\SetupModel;
use App\Models\SetupPosition;
use App\Models\SetupProject;
use App\Models\SetupSupplier;
use App\Models\SetupUnitMeasure;
use App\Models\SetupUser;

return [
    'companies' => [
        'model' => SetupCompany::class,
        'id_key' => 'id',
    ],
    'branches' => [
        'model' => SetupBranch::class,
        'id_key' => 'id',
    ],
    'users' => [
        'model' => SetupUser::class,
        'id_key' => 'id',
    ],
    'positions' => [
        'model' => SetupPosition::class,
        'id_key' => 'id',
    ],
    'projects' => [
        'model' => SetupProject::class,
        'id_key' => 'id',
    ],
    'categories' => [
        'model' => SetupCategory::class,
        'id_key' => 'id',
    ],
    'brands' => [
        'model' => SetupBrand::class,
        'id_key' => 'id',
    ],
    'models' => [
        'model' => SetupModel::class,
        'id_key' => 'id',
    ],
    'units' => [
        'model' => SetupUnitMeasure::class,
        'id_key' => 'id',
    ],
    'items' => [
        'model' => SetupItem::class,
        'id_key' => 'id',
    ],
    'suppliers' => [
        'model' => SetupSupplier::class,
        'id_key' => 'id',
    ],
    'customers' => [
        'model' => SetupCustomer::class,
        'id_key' => 'id',
    ],
];
