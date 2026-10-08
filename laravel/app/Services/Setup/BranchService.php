<?php

namespace App\Services\Setup;

use App\Models\Branch;
use App\Services\Setup\Concerns\PaginatesSetupQueries;
use Illuminate\Http\Request;

class BranchService
{
    use PaginatesSetupQueries;

    public function getBranches(Request $request)
    {
        $query = Branch::query()->orderBy('name');

        $this->applySearch($query, $request->query('search'), ['name', 'code', 'address']);
        $this->applyStatusFilter($query, $request->query('status'));

        return $this->paginateQuery($query, $request);
    }

    public function getBranchById(int $id): Branch
    {
        return Branch::query()->findOrFail($id);
    }

    public function createBranch(array $data): Branch
    {
        return Branch::query()->create($data);
    }

    public function updateBranch(Branch $branch, array $data): Branch
    {
        $branch->update($data);

        return $branch->fresh();
    }

    public function deleteBranch(Branch $branch): void
    {
        $branch->delete();
    }
}
