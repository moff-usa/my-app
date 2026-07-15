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
app.use(express.static("public"));

// メイン画面：ユーザー一覧を表示するぞ
app.get("/", async (req, res) => {
  // 1. Userの代わりに、新しく作った Todo テーブルからデータを全部取ってくるのじゃ
  const todos = await prisma.todo.findMany({
    orderBy: {
      createdAt: "desc", // 新しいタスクが上にくるように並び替えるぞ
    },
  });

  // 2. 画面（index.ejs）に todos という名前でデータを渡してあげるのじゃ
  res.render("index", { todos });
});

app.post("/todos", async (req, res) => {
  const title = req.body.title;
  const deadline = req.body.deadline;
  const priority = req.body.priority;

  if (title) {
    // データベースの Todo テーブルに新しく保存（作成）するぞ
    await prisma.todo.create({
      data: {
        title: title,
        deadline: deadline || null, // 未入力なら空っぽ（null）にする
        priority: priority || "medium", // 未入力なら「普通」にする
      },
    });
  }
  // 保存が終わったら、メイン画面（"/"）に自動で戻す（リフレッシュする）のじゃ
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`サーバーが動いておるぞ！ http://localhost:${PORT}`);
});
