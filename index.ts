import "dotenv/config";
import express from "express";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";

// データベース接続の準備
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter, log: ["query"] });

const app = express();
const PORT = process.env.PORT || 8888;

// EJS を使うための設定じゃ
app.set("view engine", "ejs");
app.set("views", "./views");
// フォームから送られてきたデータを受け取るための設定じゃ
app.use(express.urlencoded({ extended: true }));

// メイン画面：ユーザー一覧を表示するぞ
app.get("/", async (req, res) => {
  const users = await prisma.user.findMany();
  res.render("index", { users });
});

// ユーザー追加：フォームからの POST を受け取って DB に保存するぞ
app.post("/users", async (req, res) => {
  const name = req.body.name;
  const age = req.body.age;
  if (name) {
    await prisma.user.create({
      data: {
        name,
        // フォームからの数字をプログラムで扱える数値（Int）に変換して保存するぞ
        age: age ? parseInt(age) : null,
      },
    });
  }
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`サーバーが動いておるぞ！ http://localhost:${PORT}`);
});
