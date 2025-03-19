# Backend Routes Documentation

This document provides an overview of the backend routes for the candidate and interviewer functionalities, including signup and login.

## Table of Contents

1. [Candidate Routes](#candidate-routes)
   - [Candidate Signup](#candidate-signup)
   - [Candidate Login](#candidate-login)
2. [Interviewer Routes](#interviewer-routes)
   - [Interviewer Signup](#interviewer-signup)
   - [Interviewer Login](#interviewer-login)

## Candidate Routes

### Candidate Signup

**Route:** `POST /candidate-signup`

**Description:**  
This route allows a new candidate to sign up by providing their `userName`, `fullName`, `email`, and `password`.

**Request Body:**
```json
{
  "userName": "string",
  "fullName": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
- **Success (201):**
  ```json
  {
    "message": "User created successfully",
    "user": {
      "userName": "string",
      "fullName": "string",
      "email": "string",
      "passwordHash": "string"
    }
  }
  ```
- **Error (400):**
  - If any field is missing:
    ```json
    {
      "message": "All fields are required"
    }
    ```
  - If the user already exists:
    ```json
    {
      "message": "User already exists"
    }
    ```
  - If there is an error creating the user:
    ```json
    {
      "message": "Error creating user"
    }
    ```

### Candidate Login

**Route:** `POST /candidate-login`

**Description:**  
This route allows a candidate to log in using their `userName` and `password`.

**Request Body:**
```json
{
  "userName": "string",
  "password": "string"
}
```

**Response:**
- **Success (200):**
  ```json
  {
    "message": "Login successful",
    "user": {
      "loggedInCandidate": {
        "userName": "string",
        "fullName": "string",
        "email": "string"
      },
      "accessToken": "string",
      "refreshToken": "string"
    }
  }
  ```
- **Error (400):**
  - If any field is missing:
    ```json
    {
      "message": "All fields are required"
    }
    ```
  - If the user does not exist:
    ```json
    {
      "message": "User does not exist"
    }
    ```
  - If the password is invalid:
    ```json
    {
      "message": "Invalid password"
    }
    ```

## Interviewer Routes

### Interviewer Signup

**Route:** `POST /interviewer-signup`

**Description:**  
This route allows a new interviewer to sign up by providing their `userName`, `fullName`, `email`, `company`, `position`, `password`, and `role`.

**Request Body:**
```json
{
  "userName": "string",
  "fullName": "string",
  "email": "string",
  "company": "string",
  "position": "string",
  "password": "string",
  "role": "string"
}
```

**Response:**
- **Success (201):**
  ```json
  {
    "message": "User created successfully",
    "user": {
      "userName": "string",
      "fullName": "string",
      "email": "string",
      "company": "string",
      "position": "string",
      "passwordHash": "string",
      "role": "string"
    }
  }
  ```
- **Error (400):**
  - If any field is missing:
    ```json
    {
      "message": "All fields are required"
    }
    ```
  - If the user already exists:
    ```json
    {
      "message": "User already exists"
    }
    ```
  - If there is an error creating the user:
    ```json
    {
      "message": "Error creating user"
    }
    ```

### Interviewer Login

**Route:** `POST /interviewer-login`

**Description:**  
This route allows an interviewer to log in using their `userName` and `password`.

**Request Body:**
```json
{
  "userName": "string",
  "password": "string"
}
```

**Response:**
- **Success (200):**
  ```json
  {
    "message": "Login successful",
    "user": {
      "loggedInaInterviewer": {
        "userName": "string",
        "fullName": "string",
        "email": "string",
        "company": "string",
        "position": "string",
        "role": "string"
      },
      "accessToken": "string",
      "refreshToken": "string"
    }
  }
  ```
- **Error (400):**
  - If any field is missing:
    ```json
    {
      "message": "All fields are required"
    }
    ```
  - If the user does not exist:
    ```json
    {
      "message": "User does not exist"
    }
    ```
  - If the password is invalid:
    ```json
    {
      "message": "Invalid password"
    }
    ```

---

