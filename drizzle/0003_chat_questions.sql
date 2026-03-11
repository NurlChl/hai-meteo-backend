CREATE TABLE IF NOT EXISTS "chat_questions" (
    "id" bigserial PRIMARY KEY NOT NULL,
    "question" text NOT NULL,
    "sort_order" integer DEFAULT 0 NOT NULL,
    "is_enabled" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL
);

-- Seed the 3 default quick-action questions
INSERT INTO "chat_questions" ("question", "sort_order", "is_enabled") VALUES
    ('Saya ingin tau apa itu HAI-Meteo', 1, true),
    ('Saya bingung harus kontak ke mana', 2, true),
    ('Butuh info lebih lanjut tentang layanan.', 3, true);
