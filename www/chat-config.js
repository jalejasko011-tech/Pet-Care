// Public chat retired in 1.8.16. Firebase configuration is retained for optional family sharing.
window.PETCARE_CHAT_CONFIG = {
  "enabled": false,
  "media": {"enabled": false, "bucket": ""},
  "push": {"enabled": false},
  "firebase": {
    "apiKey": "AIzaSyDG4ly3BEPk92KmQGhioOREkuNyT1LABjU",
    "authDomain": "pet-care-world.firebaseapp.com",
    "projectId": "pet-care-world",
    "appId": "1:1025562403962:web:7c9461b8b454b985a987c3"
  }
};

// Production rules/Auth and three independent live clients verified 21 October 2026.
window.PETCARE_FAMILY_CONFIG = { enabled: true };
