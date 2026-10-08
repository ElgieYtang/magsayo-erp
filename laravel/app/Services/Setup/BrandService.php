<?php

namespace App\Services\Setup;

use App\Models\Brand;
use App\Services\Setup\Concerns\PaginatesSetupQueries;
use Illuminate\Http\Request;

class BrandService
{
    use PaginatesSetupQueries;

    public function getBrands(Request $request)
    {
        $query = Brand::query()->orderBy('name');

        $this->applySearch($query, $request->query('search'), ['name', 'code', 'description']);
        $this->applyStatusFilter($query, $request->query('status'));

        return $this->paginateQuery($query, $request);
    }

    public function getBrandById(int $id): Brand
    {
        return Brand::query()->findOrFail($id);
    }

    public function createBrand(array $data): Brand
    {
        return Brand::query()->create($data);
    }

    public function updateBrand(Brand $brand, array $data): Brand
    {
        $brand->update($data);

        return $brand->fresh();
    }

    public function deleteBrand(Brand $brand): void
    {
        if ($brand->productModels()->exists() || $brand->items()->exists()) {
            throw new \RuntimeException(
                'Cannot delete this brand because it is currently being used by existing items or models.',
            );
        }

        $brand->delete();
    }
}
