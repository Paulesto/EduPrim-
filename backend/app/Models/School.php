<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'adresse',
        'telephone',
        'email',
    ];

    // Relations
    public function admin()
    {
        return $this->hasOne(User::class)->where('role', 'school_admin');
    }

    public function teachers()
    {
        return $this->hasMany(Teacher::class);
    }

    public function subjects()
    {
        return $this->hasMany(Subject::class);
    }

    public function classrooms()
    {
        return $this->hasMany(Classroom::class);
    }

    public function students()
    {
        return $this->hasManyThrough(Student::class, Classroom::class);
    }

    public function calendars()
    {
        return $this->hasMany(Calendar::class);
    }
}
