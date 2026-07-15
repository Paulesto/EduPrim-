<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .header { background: #1d4ed8; padding: 32px; text-align: center; }
    .header h1 { color: #fff; font-size: 22px; margin: 0; }
    .header p { color: #bfdbfe; font-size: 13px; margin-top: 6px; }
    .body { padding: 32px; }
    .body p { color: #374151; font-size: 14px; line-height: 1.6; }
    .credentials { background: #f0f7ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0; }
    .credentials p { margin: 6px 0; font-size: 14px; color: #1e40af; }
    .credentials strong { display: inline-block; width: 100px; color: #374151; }
    .btn { display: block; width: fit-content; margin: 24px auto; padding: 12px 28px; background: #1d4ed8; color: #fff; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 600; }
    .footer { background: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 EduPrim</h1>
      <p>Plateforme de gestion des écoles primaires</p>
    </div>
    <div class="body">
      <p>Bonjour <strong>{{ $adminName }}</strong>,</p>
      <p>
        Votre compte administrateur a été créé avec succès pour l'école
        <strong>{{ $schoolName }}</strong>.
        Voici vos identifiants de connexion :
      </p>
      <div class="credentials">
        <p><strong>Email :</strong> {{ $adminEmail }}</p>
        <p><strong>Mot de passe :</strong> {{ $password }}</p>
      </div>
      <p style="color:#ef4444; font-size:13px;">
        ⚠️ Pour votre sécurité, changez votre mot de passe dès votre première connexion.
      </p>
      <a href="http://localhost:5173/login" class="btn">
        Se connecter →
      </a>
    </div>
    <div class="footer">
      EduPrim — Gestion des écoles primaires<br>
      Cet email a été envoyé automatiquement, merci de ne pas y répondre.
    </div>
  </div>
</body>
</html>
