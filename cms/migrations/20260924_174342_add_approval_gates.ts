import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "portfolio" ADD COLUMN "client_approved" boolean DEFAULT false;
  ALTER TABLE "portfolio" ADD COLUMN "image_rights_cleared" boolean DEFAULT false;
  ALTER TABLE "faq" ADD COLUMN "published" boolean DEFAULT false;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "portfolio" DROP COLUMN "client_approved";
  ALTER TABLE "portfolio" DROP COLUMN "image_rights_cleared";
  ALTER TABLE "faq" DROP COLUMN "published";`)
}
