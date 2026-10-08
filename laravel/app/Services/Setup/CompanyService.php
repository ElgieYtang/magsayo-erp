<?php

namespace App\Services\Setup;

use App\Models\Company;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class CompanyService
{
    public function getCompany(): ?Company
    {
        return Company::query()->first();
    }

    public function createCompany(array $data): Company
    {
        return DB::transaction(function () use ($data) {
            if (Company::query()->exists()) {
                throw new \RuntimeException('A company record already exists. Use update instead.');
            }

            return Company::query()->create($data);
        });
    }

    public function updateCompany(Company $company, array $data): Company
    {
        $company->update($data);

        return $company->fresh();
    }

    public function uploadCompanyLogo(Company $company, UploadedFile $logo): Company
    {
        if ($company->logo_path) {
            Storage::disk('public')->delete($company->logo_path);
        }

        $path = $logo->store('setups/companies/logos', 'public');
        $company->update(['logo_path' => $path]);

        return $company->fresh();
    }
}
