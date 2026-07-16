<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\AdminCredentialsMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            return response()->json(['message' => 'Email ou mot de passe incorrect.'], 401);
        }

        $user = Auth::user();

        if (!$user->is_active) {
            return response()->json(['message' => 'Votre compte est désactivé.'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Connexion réussie.',
            'token'   => $token,
            'user'    => [
                'id'        => $user->id,
                'name'      => $user->name,
                'email'     => $user->email,
                'role'      => $user->role,
                'school_id' => $user->school_id,
            ]
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Déconnexion réussie.']);
    }

    public function me(Request $request)
    {
        return response()->json(['user' => $request->user()->load('school')]);
    }

    // Mot de passe oublié
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Si cet email existe, un lien de réinitialisation sera envoyé.'
            ]);
        }

        $newPassword = Str::random(10);
        $user->password = Hash::make($newPassword);
        $user->save();

        // Envoyer le nouveau mot de passe par email
        Mail::to($user->email)->send(
            new AdminCredentialsMail(
                $user->name,
                $user->email,
                $newPassword,
                $user->school?->nom ?? 'EduPrim'
            )
        );

        return response()->json([
            'message' => 'Un nouveau mot de passe a été envoyé à votre adresse email.'
        ]);
    }

    // Changement de mot de passe
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password'     => 'required|string|min:6',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'message' => 'Le mot de passe actuel est incorrect.'
            ], 422);
        }

        $user->password = Hash::make($request->new_password);
        $user->save();

        return response()->json([
            'message' => 'Mot de passe modifié avec succès.'
        ]);
    }
}
