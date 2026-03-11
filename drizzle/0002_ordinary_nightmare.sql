ALTER TABLE "page_sections" DROP CONSTRAINT "page_sections_background_media_id_media_assets_id_fk";
--> statement-breakpoint
ALTER TABLE "page_sections" DROP COLUMN "section_type";--> statement-breakpoint
ALTER TABLE "page_sections" DROP COLUMN "title";--> statement-breakpoint
ALTER TABLE "page_sections" DROP COLUMN "subtitle";--> statement-breakpoint
ALTER TABLE "page_sections" DROP COLUMN "background_media_id";