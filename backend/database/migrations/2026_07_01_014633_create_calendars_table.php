<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('calendars', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->enum('type', ['vacances', 'examen', 'reunion', 'sortie']);
            $table->date('date_debut');
            $table->date('date_fin');
            $table->text('description')->nullable();
            $table->foreignId('school_id')->constrained('schools')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('calendars');
    }
};
