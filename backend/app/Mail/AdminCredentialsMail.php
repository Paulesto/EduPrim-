<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminCredentialsMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $adminName;
    public string $adminEmail;
    public string $password;
    public string $schoolName;

    public function __construct(string $adminName, string $adminEmail, string $password, string $schoolName)
    {
        $this->adminName  = $adminName;
        $this->adminEmail = $adminEmail;
        $this->password   = $password;
        $this->schoolName = $schoolName;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address('noreply@eduprim.ma', 'EduPrim'),
            subject: 'Vos identifiants EduPrim',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admin-credentials',
        );
    }
}
