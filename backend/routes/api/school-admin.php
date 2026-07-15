<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SchoolAdmin\TeacherController;
use App\Http\Controllers\SchoolAdmin\SubjectController;
use App\Http\Controllers\SchoolAdmin\ClassroomController;
use App\Http\Controllers\SchoolAdmin\StudentController;
use App\Http\Controllers\SchoolAdmin\CalendarController;

Route::prefix('school')
    ->middleware(['auth:sanctum', 'role:school_admin'])
    ->group(function () {
        Route::apiResource('teachers', TeacherController::class);
        Route::apiResource('subjects', SubjectController::class);
        Route::apiResource('classrooms', ClassroomController::class);
        Route::apiResource('students', StudentController::class);
        Route::apiResource('calendars', CalendarController::class);
    });
