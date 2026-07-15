<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Mail\AdminCredentialsMail;
use App\Models\School;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AdminController extends Controller
{
    public function index()
    {
        $admins = User::where('role', 'school_admin')
                      ->with('school')
                      ->get();

        return response()->json(['admins' => $admins]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'      => 'required|string|max:255',
            'email'     => 'required|email|unique:users,email',
            'telephone' => 'required|string',
            'school_id' => 'required|exists:schools,id',
        ]);

        $password = Str::random(10);
        $school   = School::findOrFail($request->school_id);

        $admin = User::create([
            'name'      => $request->name,
            'email'     => $request->email,
            'password'  => Hash::make($password),
            'role'      => 'school_admin',
            'school_id' => $request->school_id,
            'is_active' => true,
        ]);

        // Envoi de l'email avec les identifiants
        Mail::alwaysFrom('noreply@eduprim.ma', 'EduPrim');
        Mail::to($admin->email)->send(
            new AdminCredentialsMail(
                $admin->name,
                $admin->email,
                $password,
                $school->nom
            )
        );
        return response()->json([
            'message' => 'Administrateur créé et identifiants envoyés par email.',
            'admin'   => $admin,
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $admin = User::where('role', 'school_admin')->findOrFail($id);

        $request->validate([
            'name'      => 'sometimes|string|max:255',
            'email'     => 'sometimes|email|unique:users,email,' . $id,
            'school_id' => 'sometimes|exists:schools,id',
        ]);

        $admin->update($request->only(['name', 'email', 'school_id']));

        return response()->json([
            'message' => 'Administrateur modifié avec succès.',
            'admin'   => $admin,
        ]);
    }

    public function toggle(string $id)
    {
        $admin = User::where('role', 'school_admin')->findOrFail($id);
        $admin->is_active = !$admin->is_active;
        $admin->save();

        $status = $admin->is_active ? 'activé' : 'désactivé';

        return response()->json([
            'message' => "Compte $status avec succès.",
            'admin'   => $admin,
        ]);
    }

    public function destroy(string $id)
    {
        $admin = User::where('role', 'school_admin')->findOrFail($id);
        $admin->delete();

        return response()->json(['message' => 'Administrateur supprimé avec succès.']);
    }
}
