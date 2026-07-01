import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

// PostgreSQL に接続するためのコネクションプールとアダプターを用意する
// これが Prisma 7 でデータベースに繋ぐための「お作法」じゃ
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["query"] });

async function main() {
  console.log("データベースに接続中...");

  // ユーザーを 1 件追加してみるぞ
  const newUser = await prisma.user.create({
    data: { name: `ユーザー ${new Date().toISOString()}` },
  });
  console.log("新しいユーザーを作成したぞ:", newUser);

  // 登録されているユーザーを全員連れてくるのじゃ
  const allUsers = await prisma.user.findMany();
  console.log("現在のユーザー一覧:", allUsers);
}

main()
  .catch((e) => {
    console.error("エラーが発生したぞ:", e);
    process.exit(1);
  })
  .finally(async () => {
    // 最後にしっかり接続を閉じるのが、行儀の良いプログラムじゃ
    await prisma.$disconnect();
    await pool.end();
  });
