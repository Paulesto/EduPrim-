<?php

namespace App\Http\Controllers\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\School;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class SchoolController extends Controller
{
    // Liste toutes les écoles
    public function index()
    {
        $schools = School::with('admin')->get();

        return response()->json([
            'schools' => $schools
        ]);
    }

    // Créer une école
    public function store(Request $request)
    {
        $request->validate([
            'nom'       => 'required|string|max:255',
            'adresse'   => 'required|string',
            'telephone' => 'required|string',
            'email'     => 'required|email|unique:schools,email',
        ]);

        $school = School::create($request->only([
            'nom', 'adresse', 'telephone', 'email'
        ]));

        return response()->json([
            'message' => 'École créée avec succès.',
            'school'  => $school
        ], 201);
    }

    // Détail d'une école
    public function show(string $id)
    {
        $school = School::with(['admin', 'teachers', 'classrooms'])->findOrFail($id);

        return response()->json([
            'school' => $school
        ]);
    }

    // Modifier une école
    public function update(Request $request, string $id)
    {
        $school = School::findOrFail($id);

        $request->validate([
            'nom'       => 'sometimes|string|max:255',
            'adresse'   => 'sometimes|string',
            'telephone' => 'sometimes|string',
            'email'     => 'sometimes|email|unique:schools,email,' . $id,
        ]);

        $school->update($request->only([
            'nom', 'adresse', 'telephone', 'email'
        ]));

        return response()->json([
            'message' => 'École modifiée avec succès.',
            'school'  => $school
        ]);
    }

    // Supprimer une école
    public function destroy(string $id)
    {
        $school = School::findOrFail($id);
        $school->delete();

        return response()->json([
            'message' => 'École supprimée avec succès.'
        ]);
    }
}
