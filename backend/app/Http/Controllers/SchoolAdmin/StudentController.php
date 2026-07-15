<?php

namespace App\Http\Controllers\SchoolAdmin;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Classroom;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $students = Student::whereHas('classroom', function ($query) use ($request) {
                                $query->where('school_id', $request->user()->school_id);
                            })
                           ->with('classroom')
                           ->get();

        return response()->json([
            'students' => $students
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
        $student = Student::whereHas('classroom', function ($query) use ($request) {
                               $query->where('school_id', $request->user()->school_id);
                           })
                          ->with('classroom')
                          ->findOrFail($id);

        return response()->json([
            'student' => $student
        ]);
    }

    public function update(Request $request, string $id)
    {
        $student = Student::whereHas('classroom', function ($query) use ($request) {
                               $query->where('school_id', $request->user()->school_id);
                           })
                          ->findOrFail($id);

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
        $student = Student::whereHas('classroom', function ($query) use ($request) {
                               $query->where('school_id', $request->user()->school_id);
                           })
                          ->findOrFail($id);
        $student->delete();

        return response()->json([
            'message' => 'Élève supprimé avec succès.'
        ]);
    }
}
