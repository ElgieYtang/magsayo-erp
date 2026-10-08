<?php

namespace App\Http\Controllers\Api\Setup;

use App\Http\Controllers\Controller;
use App\Http\Requests\Setup\CompanyRequest;
use App\Http\Requests\Setup\UploadCompanyLogoRequest;
use App\Models\Company;
use App\Services\Setup\CompanyService;
use App\Support\ApiResponse;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    use HandlesSetupActions;

    public function __construct(private readonly CompanyService $service) {}

    public function index()
    {
        $company = $this->service->getCompany();

        if (! $company) {
            return ApiResponse::success(['company' => null], 'No company record found yet.');
        }

        return ApiResponse::success(['company' => $company], 'Company retrieved successfully.');
    }

    public function store(CompanyRequest $request)
    {
        return $this->runSetupAction(function () use ($request) {
            $company = $this->service->createCompany($request->validated());

            return ApiResponse::success(
                ['company' => $company],
                'Company created successfully.',
                201,
            );
        });
    }

    public function show(Company $company)
    {
        return ApiResponse::success(['company' => $company], 'Company retrieved successfully.');
    }

    public function update(CompanyRequest $request, Company $company)
    {
        $company = $this->service->updateCompany($company, $request->validated());

        return ApiResponse::success(['company' => $company], 'Company updated successfully.');
    }

    public function uploadLogo(UploadCompanyLogoRequest $request, Company $company)
    {
        $company = $this->service->uploadCompanyLogo($company, $request->file('logo'));

        return ApiResponse::success(['company' => $company], 'Company logo uploaded successfully.');
    }
}
