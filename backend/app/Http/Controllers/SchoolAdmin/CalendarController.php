<?php

namespace App\Http\Controllers\SchoolAdmin;

use App\Http\Controllers\Controller;
use App\Models\Calendar;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    public function index(Request $request)
    {
        $events = Calendar::where('school_id', $request->user()->school_id)
                          ->orderBy('date_debut')
                          ->get();

        return response()->json([
            'events' => $events
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titre'       => 'required|string|max:255',
            'type'        => 'required|in:vacances,examen,reunion,sortie',
            'date_debut'  => 'required|date',
            'date_fin'    => 'required|date|after_or_equal:date_debut',
            'description' => 'nullable|string',
        ]);

        $event = Calendar::create([
            'titre'       => $request->titre,
            'type'        => $request->type,
            'date_debut'  => $request->date_debut,
            'date_fin'    => $request->date_fin,
            'description' => $request->description,
            'school_id'   => $request->user()->school_id,
        ]);

        return response()->json([
            'message' => 'Événement ajouté avec succès.',
            'event'   => $event
        ], 201);
    }

    public function update(Request $request, string $id)
    {
        $event = Calendar::where('school_id', $request->user()->school_id)
                         ->findOrFail($id);

        $request->validate([
            'titre'       => 'sometimes|string|max:255',
            'type'        => 'sometimes|in:vacances,examen,reunion,sortie',
            'date_debut'  => 'sometimes|date',
            'date_fin'    => 'sometimes|date|after_or_equal:date_debut',
            'description' => 'nullable|string',
        ]);

        $event->update($request->only([
            'titre', 'type', 'date_debut', 'date_fin', 'description'
        ]));

        return response()->json([
            'message' => 'Événement modifié avec succès.',
            'event'   => $event
        ]);
    }

    public function destroy(Request $request, string $id)
    {
        $event = Calendar::where('school_id', $request->user()->school_id)
                         ->findOrFail($id);
        $event->delete();

        return response()->json([
            'message' => 'Événement supprimé avec succès.'
        ]);
    }
}
