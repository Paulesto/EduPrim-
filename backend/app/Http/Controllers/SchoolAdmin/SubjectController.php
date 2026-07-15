<?php

namespace App\Http\Controllers\SchoolAdmin;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        $subjects = Subject::where('school_id', $request->user()->school_id)
                           ->get();

        return response()->json([
            'subjects' => $subjects
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'         => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $subject = Subject::create([
            'nom'         => $request->nom,
            'description' => $request->description,
            'school_id'   => $request->user()->school_id,
        ]);

        return response()->json([
            'message' => 'Matière ajoutée avec succès.',
            'subject' => $subject
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $subject = Subject::where('school_id', $request->user()->school_id)
                          ->findOrFail($id);

        $request->validate([
            'nom'         => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        $subject->update($request->only(['nom', 'description']));

        return response()->json([
            'message' => 'Matière modifiée avec succès.',
            'subject' => $subject
        ]);
    }

    public function destroy(Request $request, string $id)
    {
        $subject = Subject::where('school_id', $request->user()->school_id)
                          ->findOrFail($id);
        $subject->delete();

        return response()->json([
            'message' => 'Matière supprimée avec succès.'
        ]);
    }
}
