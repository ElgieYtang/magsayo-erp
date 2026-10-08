<?php

namespace App\Services\Setup;

use App\Models\Category;
use App\Services\Setup\Concerns\PaginatesSetupQueries;
use Illuminate\Http\Request;

class CategoryService
{
    use PaginatesSetupQueries;

    public function getCategories(Request $request)
    {
        $query = Category::query()->orderBy('name');

        $this->applySearch($query, $request->query('search'), ['name', 'code', 'description']);
        $this->applyStatusFilter($query, $request->query('status'));

        return $this->paginateQuery($query, $request);
    }

    public function getCategoryById(int $id): Category
    {
        return Category::query()->findOrFail($id);
    }

    public function createCategory(array $data): Category
    {
        return Category::query()->create($data);
    }

    public function updateCategory(Category $category, array $data): Category
    {
        $category->update($data);

        return $category->fresh();
    }

    public function deleteCategory(Category $category): void
    {
        if ($category->items()->exists()) {
            throw new \RuntimeException(
                'Cannot delete this category because it is currently being used by existing items.',
            );
        }

        $category->delete();
    }
}
