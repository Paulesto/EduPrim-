<?php

namespace App\Http\Controllers\SchoolAdmin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use Illuminate\Http\Request;

class ClassroomController extends Controller
{
    public function index(Request $request)
    {
        $classrooms = Classroom::where('school_id', $request->user()->school_id)
                               ->with('teacher')
                               ->get();

        return response()->json([
            'classrooms' => $classrooms
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'        => 'required|string|max:255',
            'niveau'     => 'required|string|max:255',
            'teacher_id' => 'nullable|exists:teachers,id',
        ]);

        $classroom = Classroom::create([
            'nom'        => $request->nom,
            'niveau'     => $request->niveau,
            'teacher_id' => $request->teacher_id,
            'school_id'  => $request->user()->school_id,
        ]);

        return response()->json([
            'message'   => 'Classe ajoutée avec succès.',
            'classroom' => $classroom
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $classroom = Classroom::where('school_id', $request->user()->school_id)
                              ->findOrFail($id);

        $request->validate([
            'nom'        => 'sometimes|string|max:255',
            'niveau'     => 'sometimes|string|max:255',
            'teacher_id' => 'nullable|exists:teachers,id',
        ]);

        $classroom->update($request->only(['nom', 'niveau', 'teacher_id']));

        return response()->json([
            'message'   => 'Classe modifiée avec succès.',
            'classroom' => $classroom
        ]);
    }

    public function destroy(Request $request, string $id)
    {
        $classroom = Classroom::where('school_id', $request->user()->school_id)
                              ->findOrFail($id);
        $classroom->delete();

        return response()->json([
            'message' => 'Classe supprimée avec succès.'
        ]);
    }
}
