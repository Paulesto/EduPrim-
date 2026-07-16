<?php

namespace App\Http\Controllers\SchoolAdmin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $query = Student::whereHas('classroom', function ($q) use ($request) {
            $q->where('school_id', $request->user()->school_id);
        })->with('classroom');

        // Recherche par nom ou prénom
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nom', 'like', "%$search%")
                  ->orWhere('prenom', 'like', "%$search%");
            });
        }

        // Filtre par classe
        if ($request->has('classroom_id') && $request->classroom_id) {
            $query->where('classroom_id', $request->classroom_id);
        }

        // Filtre par sexe
        if ($request->has('sexe') && $request->sexe) {
            $query->where('sexe', $request->sexe);
        }

        $students = $query->paginate($request->get('per_page', 10));

        return response()->json([
            'students' => $students->items(),
            'pagination' => [
                'total'        => $students->total(),
                'per_page'     => $students->perPage(),
                'current_page' => $students->currentPage(),
                'last_page'    => $students->lastPage(),
            ]
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'            => 'required|string|max:255',
            'prenom'         => 'required|string|max:255',
            'sexe'           => 'required|in:M,F',
            'date_naissance' => 'required|date',
            'adresse'        => 'nullable|string',
            'contact_parent' => 'required|string',
            'classroom_id'   => 'required|exists:classrooms,id',
        ]);

        $student = Student::create($request->only([
            'nom', 'prenom', 'sexe', 'date_naissance',
            'adresse', 'contact_parent', 'classroom_id'
        ]));

        return response()->json([
            'message' => 'Élève ajouté avec succès.',
            'student' => $student->load('classroom')
        ], 201);
    }

    public function show(Request $request, string $id)
    {
        $student = Student::whereHas('classroom', function ($q) use ($request) {
            $q->where('school_id', $request->user()->school_id);
        })->with('classroom')->findOrFail($id);

        return response()->json(['student' => $student]);
    }

    public function update(Request $request, string $id)
    {
        $student = Student::whereHas('classroom', function ($q) use ($request) {
            $q->where('school_id', $request->user()->school_id);
        })->findOrFail($id);

        $request->validate([
            'nom'            => 'sometimes|string|max:255',
            'prenom'         => 'sometimes|string|max:255',
            'sexe'           => 'sometimes|in:M,F',
            'date_naissance' => 'sometimes|date',
            'adresse'        => 'nullable|string',
            'contact_parent' => 'sometimes|string',
            'classroom_id'   => 'sometimes|exists:classrooms,id',
        ]);

        $student->update($request->only([
            'nom', 'prenom', 'sexe', 'date_naissance',
            'adresse', 'contact_parent', 'classroom_id'
        ]));

        return response()->json([
            'message' => 'Élève modifié avec succès.',
            'student' => $student->load('classroom')
        ]);
    }

    public function destroy(Request $request, string $id)
    {
        $student = Student::whereHas('classroom', function ($q) use ($request) {
            $q->where('school_id', $request->user()->school_id);
        })->findOrFail($id);
        $student->delete();

        return response()->json(['message' => 'Élève supprimé avec succès.']);
    }
}
