-- Crear esquema
CREATE SCHEMA IF NOT EXISTS questionask;

-- Cambiar a ese esquema
SET search_path TO questionask;

-- Crear tabla de usuarios
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone_number TEXT,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Crear tabla de tokens de sesión
CREATE TABLE tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token TEXT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ
);


CREATE TABLE forms (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE questions (
  id UUID PRIMARY KEY,
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('short', 'long', 'multiple', 'checkbox', 'rating', 'date', 'Hora')),
  required BOOLEAN DEFAULT false,
  "order" INT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE question_options (
  id UUID PRIMARY KEY,
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  text TEXT NOT NULL
);

CREATE TABLE question_option_images (
  id UUID PRIMARY KEY,
  option_id UUID REFERENCES question_options(id) ON DELETE CASCADE,
  image_path TEXT NOT NULL
);

CREATE TABLE responses (
  id UUID PRIMARY KEY,
  form_id UUID REFERENCES forms(id) ON DELETE CASCADE,
  submitted_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE answers (
  id UUID PRIMARY KEY,
  response_id UUID REFERENCES responses(id) ON DELETE CASCADE,
  question_id UUID REFERENCES questions(id),
  answer_text TEXT
);




-- Crear tabla de preguntas
CREATE TABLE forms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_text TEXT NOT NULL,
    answer TEXT,
    type TEXT NOT NULL CHECK (type IN ('short', 'long', 'multiple', 'checkbox', 'rating', 'date', 'Hora')),
    options JSONB, -- array JSON dinámico si aplica (ej: ["opción 1", "opción 2"])
    required BOOLEAN DEFAULT FALSE,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE password_resets (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
