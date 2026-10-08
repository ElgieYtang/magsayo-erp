<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SetupUser;
use App\Support\LegacyPassword;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingsController extends Controller
{
    private const STORAGE_PATH = 'erp-settings.json';

    private function defaults(): array
    {
        return [
            'company_name' => 'RESPONSIVCODE TECHNOLOGY SOLUTIONS',
            'company_address' => 'Room 301E-3, Medalle Building, Fuente Osmeña, Cebu City 6000',
            'company_phone' => '(032) 345-2283 / +63 917 573 4911',
            'company_email' => 'lark.gel@gmail.com',
            'date_format' => 'F j, Y',
            'paper_size' => 'A4',
            'auto_open_preview' => true,
            'timezone' => 'Asia/Manila',
            'currency' => 'PHP',
            'language' => 'en',
            'notify_in_app' => true,
            'notify_email' => false,
            'notify_quotations' => true,
            'notify_purchase_orders' => true,
            'notify_receiving' => true,
            'notify_deliveries' => true,
            'notify_billing' => true,
        ];
    }

    public function show(): JsonResponse
    {
        if (Storage::disk('local')->exists(self::STORAGE_PATH)) {
            $stored = json_decode(Storage::disk('local')->get(self::STORAGE_PATH), true);

            if (is_array($stored)) {
                return response()->json(array_merge($this->defaults(), $stored));
            }
        }

        return response()->json($this->defaults());
    }

    public function update(Request $request): JsonResponse
    {
        $payload = $request->validate([
            'company_name' => ['nullable', 'string', 'max:255'],
            'company_address' => ['nullable', 'string', 'max:500'],
            'company_phone' => ['nullable', 'string', 'max:255'],
            'company_email' => ['nullable', 'email', 'max:255'],
            'date_format' => ['nullable', 'string', 'max:50'],
            'paper_size' => ['nullable', 'string', 'max:20'],
            'auto_open_preview' => ['nullable', 'boolean'],
            'timezone' => ['nullable', 'string', 'max:80'],
            'currency' => ['nullable', 'string', 'max:10'],
            'language' => ['nullable', 'string', 'max:10'],
            'notify_in_app' => ['nullable', 'boolean'],
            'notify_email' => ['nullable', 'boolean'],
            'notify_quotations' => ['nullable', 'boolean'],
            'notify_purchase_orders' => ['nullable', 'boolean'],
            'notify_receiving' => ['nullable', 'boolean'],
            'notify_deliveries' => ['nullable', 'boolean'],
            'notify_billing' => ['nullable', 'boolean'],
        ]);

        $current = Storage::disk('local')->exists(self::STORAGE_PATH)
            ? json_decode(Storage::disk('local')->get(self::STORAGE_PATH), true)
            : [];

        $merged = array_merge($this->defaults(), is_array($current) ? $current : [], $payload);

        Storage::disk('local')->put(self::STORAGE_PATH, json_encode($merged, JSON_PRETTY_PRINT));

        return response()->json([
            'message' => 'Settings saved successfully.',
            'data' => $merged,
        ]);
    }

    public function updatePassword(Request $request): JsonResponse
    {
        /** @var SetupUser $user */
        $user = $request->attributes->get('auth_user');

        $payload = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['nullable', 'string', 'min:6', 'required_without:new_password'],
            'password_confirmation' => ['nullable', 'string', 'same:password', 'required_with:password'],
            'new_password' => ['nullable', 'string', 'min:6', 'required_without:password'],
            'confirm_password' => ['nullable', 'string', 'same:new_password', 'required_with:new_password'],
        ]);

        $newPassword = $payload['password'] ?? $payload['new_password'] ?? null;
        $confirmPassword = $payload['password_confirmation'] ?? $payload['confirm_password'] ?? null;

        if (! $newPassword || $newPassword !== $confirmPassword) {
            return response()->json([
                'message' => 'New password and confirmation do not match.',
            ], 422);
        }

        if (! LegacyPassword::verify($payload['current_password'], (string) $user->password)) {
            return response()->json([
                'message' => 'Current password is incorrect.',
            ], 422);
        }

        $user->forceFill([
            'password' => LegacyPassword::hash($newPassword),
        ])->save();

        return response()->json([
            'message' => 'Password updated successfully.',
        ]);
    }
}
