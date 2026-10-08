<?php

namespace App\Services\Setup;

use App\Models\Position;
use App\Services\Setup\Concerns\PaginatesSetupQueries;
use Illuminate\Http\Request;

class PositionService
{
    use PaginatesSetupQueries;

    public function getPositions(Request $request)
    {
        $query = Position::query()->orderBy('name');

        $this->applySearch($query, $request->query('search'), ['name', 'code', 'description']);
        $this->applyStatusFilter($query, $request->query('status'));

        return $this->paginateQuery($query, $request);
    }

    public function getPositionById(int $id): Position
    {
        return Position::query()->findOrFail($id);
    }

    public function createPosition(array $data): Position
    {
        return Position::query()->create($data);
    }

    public function updatePosition(Position $position, array $data): Position
    {
        $position->update($data);

        return $position->fresh();
    }

    public function deletePosition(Position $position): void
    {
        $position->delete();
    }
}
