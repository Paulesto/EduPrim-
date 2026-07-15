<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'prenom',
        'sexe',
        'date_naissance',
        'adresse',
        'contact_parent',
        'classroom_id',
    ];

    protected $casts = [
        'date_naissance' => 'date',
    ];

    // Relations
    public function classroom()
    {
        return $this->belongsTo(Classroom::class);
    }
}
