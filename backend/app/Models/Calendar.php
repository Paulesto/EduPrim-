<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Calendar extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'type',
        'date_debut',
        'date_fin',
        'description',
        'school_id',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    // Relations
    public function school()
    {
        return $this->belongsTo(School::class);
    }
}
