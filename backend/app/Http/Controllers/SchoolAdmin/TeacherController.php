<?php

namespace App\Http\Controllers\SchoolAdmin;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use Illuminate\Http\Request;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $query = Teacher::where('school_id', $request->user()->school_id);

        // Recherche par nom ou prénom
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nom', 'like', "%$search%")
                  ->orWhere('prenom', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
            });
        }

        $teachers = $query->paginate($request->get('per_page', 10));

        return response()->json([
            'teachers' => $teachers->items(),
            'pagination' => [
                'total'        => $teachers->total(),
                'per_page'     => $teachers->perPage(),
                'current_page' => $teachers->currentPage(),
                'last_page'    => $teachers->lastPage(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'       => 'required|string|max:255',
            'prenom'    => 'required|string|max:255',
            'email'     => 'required|email|unique:teachers,email',
            'telephone' => 'required|string',
        ]);

        $teacher = Teacher::create([
            'nom'       => $request->nom,
            'prenom'    => $request->prenom,
            'email'     => $request->email,
            'telephone' => $request->telephone,
            'school_id' => $request->user()->school_id,
        ]);

        return response()->json([
            'message' => 'Enseignant ajouté avec succès.',
            'teacher' => $teacher
        ], 201);
    }

    public function show(Request $request, string $id)
    {
        $teacher = Teacher::where('school_id', $request->user()->school_id)
                          ->with('classrooms')
                          ->findOrFail($id);

        return response()->json(['teacher' => $teacher]);
    }

    public function update(Request $request, string $id)
    {
        $teacher = Teacher::where('school_id', $request->user()->school_id)
                          ->findOrFail($id);

        $request->validate([
            'nom'       => 'sometimes|string|max:255',
            'prenom'    => 'sometimes|string|max:255',
            'email'     => 'sometimes|email|unique:teachers,email,' . $id,
            'telephone' => 'sometimes|string',
        ]);

        $teacher->update($request->only(['nom', 'prenom', 'email', 'telephone']));

        return response()->json([
            'message' => 'Enseignant modifié avec succès.',
            'teacher' => $teacher
        ]);
    }

    public function destroy(Request $request, string $id)
    {
        $teacher = Teacher::where('school_id', $request->user()->school_id)
                          ->findOrFail($id);
        $teacher->delete();

        return response()->json(['message' => 'Enseignant supprimé avec succès.']);
    }
}
