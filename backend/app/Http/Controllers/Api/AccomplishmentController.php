<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Accomplishment;
use App\Models\AccomplishmentDetail;
use App\Models\SetupPosition;
use App\Models\SetupProject;
use App\Support\DocumentNumber;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AccomplishmentController extends Controller
{
    public function index(): JsonResponse
    {
        $rows = Accomplishment::query()
            ->with(['details', 'project', 'preparer'])
            ->orderByDesc('id')
            ->get()
            ->map(fn (Accomplishment $row) => $this->present($row));

        return response()->json(['data' => $rows]);
    }

    public function show(string $id): JsonResponse
    {
        return response()->json([
            'data' => $this->present($this->findReport($id)),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'projectId' => ['required', 'integer', 'exists:setup_project,id'],
            'date' => ['nullable', 'date'],
            'remarks' => ['nullable', 'string'],
            'status' => ['nullable', 'string'],
        ]);

        $user = $request->attributes->get('auth_user');
        $project = SetupProject::query()->findOrFail($payload['projectId']);

        $report = DB::transaction(function () use ($payload, $user, $project) {
            $latest = Accomplishment::query()->orderByDesc('id')->value('accomplishment_no');

            return Accomplishment::query()->create([
                'accomplishment_no' => DocumentNumber::next('AR-', $latest),
                'accomplishment_date' => $payload['date'] ?? now()->toDateString(),
                'project_id' => $project->id,
                'remarks' => $payload['remarks'] ?? null,
                'prepared_by' => $user?->id ?? 0,
                'status' => $this->statusToDb($payload['status'] ?? 'pending'),
            ])->load(['details', 'project', 'preparer']);
        });

        return response()->json([
            'message' => 'Accomplishment report created successfully.',
            'data' => $this->present($report),
        ], 201);
    }

    public function update(Request $request, string $id): JsonResponse
    {
        $report = $this->findReport($id);

        $payload = $request->validate([
            'projectId' => ['sometimes', 'integer', 'exists:setup_project,id'],
            'date' => ['nullable', 'date'],
            'remarks' => ['nullable', 'string'],
            'status' => ['sometimes', 'string'],
        ]);

        if (isset($payload['projectId'])) {
            $report->project_id = $payload['projectId'];
        }
        if (array_key_exists('date', $payload)) {
            $report->accomplishment_date = $payload['date'] ?? $report->accomplishment_date;
        }
        if (array_key_exists('remarks', $payload)) {
            $report->remarks = $payload['remarks'];
        }
        if (isset($payload['status'])) {
            $report->status = $this->statusToDb($payload['status']);
        }

        $report->save();

        return response()->json([
            'message' => 'Accomplishment report updated.',
            'data' => $this->present($report->fresh(['details', 'project', 'preparer'])),
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $report = $this->findReport($id);
        $report->status = 'INACTIVE';
        $report->save();

        return response()->json([
            'message' => 'Accomplishment report deactivated.',
            'data' => $this->present($report->fresh(['details', 'project', 'preparer'])),
        ]);
    }

    public function uploadPhotos(Request $request, string $id): JsonResponse
    {
        $report = $this->findReport($id);

        $request->validate([
            'photos' => ['required', 'array', 'min:1'],
            'photos.*' => ['required', 'image', 'max:10240'],
        ]);

        $created = [];

        foreach ($request->file('photos') as $file) {
            $filename = Str::uuid()->toString().'.'.($file->getClientOriginalExtension() ?: 'jpg');
            $path = $file->storeAs('accomplishments/'.$report->id, $filename, 'public');

            $detail = AccomplishmentDetail::query()->create([
                'accomplishment_id' => $report->id,
                'path_url' => $path,
            ]);

            $created[] = $this->presentImage($detail);
        }

        return response()->json([
            'message' => 'Photos uploaded successfully.',
            'data' => $created,
            'report' => $this->present($report->fresh(['details', 'project', 'preparer'])),
        ], 201);
    }

    public function destroyPhoto(string $id, string $photoId): JsonResponse
    {
        $report = $this->findReport($id);
        $photo = AccomplishmentDetail::query()
            ->where('accomplishment_id', $report->id)
            ->where('id', (int) $photoId)
            ->firstOrFail();

        if ($photo->path_url && Storage::disk('public')->exists($photo->path_url)) {
            Storage::disk('public')->delete($photo->path_url);
        }

        $photo->delete();

        return response()->json([
            'message' => 'Photo deleted.',
            'data' => $this->present($report->fresh(['details', 'project', 'preparer'])),
        ]);
    }

    public function showPhoto(string $id, string $photoId): StreamedResponse
    {
        $report = $this->findReport($id);
        $photo = AccomplishmentDetail::query()
            ->where('accomplishment_id', $report->id)
            ->where('id', (int) $photoId)
            ->firstOrFail();

        if (! $photo->path_url || ! Storage::disk('public')->exists($photo->path_url)) {
            abort(404, 'Photo not found.');
        }

        return Storage::disk('public')->response($photo->path_url);
    }

    private function present(Accomplishment $report): array
    {
        $report->loadMissing(['details', 'project', 'preparer']);
        $preparer = $report->preparer;
        $position = $preparer?->position_id
            ? SetupPosition::query()->find($preparer->position_id)
            : null;

        $status = $this->statusToFrontend($report->status);

        return [
            'id' => $report->accomplishment_no ?: ('AR-'.str_pad((string) $report->id, 5, '0', STR_PAD_LEFT)),
            'dbId' => (string) $report->id,
            'projectId' => (string) ($report->project_id ?? ''),
            'projectName' => $report->project?->name ?? '',
            'location' => $report->project?->address ?? '',
            'installationReportNo' => $report->accomplishment_no,
            'date' => optional($report->accomplishment_date)->format('Y-m-d'),
            'displayDate' => optional($report->accomplishment_date)->format('F j, Y'),
            'remarks' => $report->remarks,
            'preparedBy' => $preparer?->name ?? '—',
            'preparedByPosition' => $position?->name ?? 'PERSONNEL',
            'confirmedByLabel' => 'Signature of Printed Name / Position',
            'status' => $status,
            'images' => $report->details->map(fn (AccomplishmentDetail $detail) => $this->presentImage($detail))->values()->all(),
        ];
    }

    private function presentImage(AccomplishmentDetail $detail): array
    {
        return [
            'id' => (string) $detail->id,
            'alt' => 'Accomplishment photo '.$detail->id,
            'path' => $detail->path_url,
            'src' => '/accomplishments/'.$detail->accomplishment_id.'/photos/'.$detail->id.'/file',
        ];
    }

    private function statusToFrontend(?string $status): string
    {
        return match (strtoupper((string) $status)) {
            'ACTIVE', 'APPROVED' => 'approved',
            'INACTIVE', 'CANCELLED' => 'inactive',
            'DRAFT' => 'draft',
            default => 'pending',
        };
    }

    private function statusToDb(?string $status): string
    {
        return match (strtolower((string) $status)) {
            'approved', 'active' => 'ACTIVE',
            'inactive', 'cancelled' => 'INACTIVE',
            'draft' => 'DRAFT',
            default => 'PENDING',
        };
    }

    private function findReport(string $id): Accomplishment
    {
        $query = Accomplishment::query()->with(['details', 'project', 'preparer']);

        if (is_numeric($id)) {
            return $query->findOrFail((int) $id);
        }

        return $query->where('accomplishment_no', $id)->firstOrFail();
    }
}
