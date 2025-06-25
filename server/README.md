# Epitech Challenges Server API Documentation

## Base URL

```
/api
```

---

## Authentication

### Register

- **POST** `/register`
  - Body (JSON):
    - `email` (string, requis)
    - `first_name` (string, requis)
    - `last_name` (string, requis)
    - `password` (string, requis)
  - Response: Informations utilisateur (sans mot de passe)

### Login

- **POST** `/login`
  - Body (JSON):
    - `email` (string, requis)
    - `password` (string, requis)
  - Response: JWT token + informations utilisateur

---

## Account

### Get all accounts (admin)

- **GET** `/accounts`
  - Headers: `Authorization: Bearer <token>`
  - Response: Liste des comptes (sans mot de passe)

### Create account (admin)

- **POST** `/accounts`
  - Headers: `Authorization: Bearer <token>`
  - Body (JSON):
    - `email` (string, requis)
    - `first_name` (string, requis)
    - `last_name` (string, requis)
    - `password` (string, requis)
  - Response: Compte créé

### Update account (admin)

- **PUT** `/accounts`
  - Headers: `Authorization: Bearer <token>`
  - Body (JSON):
    - `id` (string, requis, identifiant du compte à modifier)
    - Autres champs modifiables : `first_name` (string), `last_name` (string), `role` (string: `student` | `teacher` | `admin`)
  - Response: Compte mis à jour

### Delete account (admin)

- **DELETE** `/accounts/:id`
  - Headers: `Authorization: Bearer <token>`
  - URL paramètre :
    - `id` (string, requis, identifiant du compte à supprimer)
  - Response: Message de suppression

### Get my account

- **GET** `/me`
  - Headers: `Authorization: Bearer <token>`
  - Response: Informations du compte courant (sans mot de passe)

### Update my account

- **PUT** `/me`
  - Headers: `Authorization: Bearer <token>`
  - Body (JSON, au moins un champ) :
    - `first_name` (string, optionnel)
    - `last_name` (string, optionnel)
    - `password` (string, optionnel)
  - Response: Compte mis à jour

---

## Activities

### Get all activities

- **GET** `/activities`
  - Headers: `Authorization: Bearer <token>`
  - Response: Liste des activités (avec challenge, teachers, students)

### Get activity by ID

- **GET** `/activities/:id`
  - Headers: `Authorization: Bearer <token>`
  - URL paramètre :
    - `id` (string, requis, identifiant de l'activité)
  - Response: Activité détaillée

### Create activity (teacher/admin)

- **POST** `/activities`
  - Headers: `Authorization: Bearer <token>`
  - Body (JSON) :
    - `title` (string, requis)
    - `visible` (boolean, requis)
    - `challenge` (string, requis, id du challenge)
    - `teachers` (array de string, optionnel, ids des enseignants)
    - `students` (array de string, optionnel, ids des étudiants)
    - `description` (string, optionnel)
    - `room` (string, optionnel)
    - `start_date` (date ISO, optionnel)
    - `end_date` (date ISO, optionnel)
    - `duration` (number, optionnel, en minutes)
  - Response: Activité créée

### Update activity (teacher/admin)

- **PUT** `/activities/:id`
  - Headers: `Authorization: Bearer <token>`
  - URL paramètre :
    - `id` (string, requis, identifiant de l'activité)
  - Body (JSON) : Un ou plusieurs champs de l'activité à modifier (voir ci-dessus)
  - Response: Activité mise à jour

### Delete activity (teacher/admin)

- **DELETE** `/activities/:id`
  - Headers: `Authorization: Bearer <token>`
  - URL paramètre :
    - `id` (string, requis, identifiant de l'activité)
  - Response: Message de suppression

---

## Challenges

### Get all challenges (teacher/admin)

- **GET** `/challenges`
  - Headers: `Authorization: Bearer <token>`
  - Response: Liste des challenges

### Get challenge by ID (teacher/admin)

- **GET** `/challenges/:id`
  - Headers: `Authorization: Bearer <token>`
  - URL paramètre :
    - `id` (string, requis, identifiant du challenge)
  - Response: Challenge détaillé

### Create challenge (teacher/admin)

- **POST** `/challenge`
  - Headers: `Authorization: Bearer <token>`
  - FormData (multipart/form-data) :
    - `title` (string, requis)
    - `description` (string, optionnel)
    - `language` (string, requis)
    - `working_files` (fichiers, optionnel, plusieurs fichiers possibles)
    - `tester` (fichier, requis, un seul fichier)
  - Response: Challenge créé

### Update challenge (teacher/admin)

- **PUT** `/challenges/:id`
  - Headers: `Authorization: Bearer <token>`
  - URL paramètre :
    - `id` (string, requis, identifiant du challenge)
  - Body (JSON) : Un ou plusieurs champs du challenge à modifier (`title`, `description`, `language`, etc.)
  - Response: Challenge mis à jour

### Delete challenge (teacher/admin)

- **DELETE** `/challenges/:id`
  - Headers: `Authorization: Bearer <token>`
  - URL paramètre :
    - `id` (string, requis, identifiant du challenge)
  - Response: Message de suppression

---

## Auth Roles

- `student` : accès limité à ses propres données
- `teacher` : accès aux activités/challenges qu'il gère
- `admin` : accès total

---

## Notes

- Toutes les routes nécessitent un token JWT sauf `/register` et `/login`.
- Les routes d'administration nécessitent le rôle `admin`.
- Les routes teacher nécessitent le rôle `teacher` ou `admin`.
- Les champs requis doivent être fournis, sinon une erreur 400 sera retournée.

---
