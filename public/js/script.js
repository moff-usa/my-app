// ==========================================
// 1. HTMLの部品（要素）をJavaScript側で捕まえる
// ==========================================
const floatingAddButton = document.getElementById("floating-add-button");
const addTaskModal = document.getElementById("add-task-modal");
const modalCancelBtn = document.getElementById("modal-cancel-btn");
const todoForm = document.getElementById("todo-form"); // ★ フォーム自体を捕まえるように変更

const taskInput = document.getElementById("task-input");
const taskDate = document.getElementById("task-date");
const taskPriority = document.getElementById("task-priority");

// ==========================================
// 2. ポップアップ（モーダル）の開閉コントロール
// ==========================================

// 右下の「＋」ボタンを押したら、ポップアップを表示する
floatingAddButton.onclick = function () {
  addTaskModal.classList.remove("hidden");
};

// 「キャンセル」ボタンを押したら、ポップアップを閉じる
modalCancelBtn.onclick = function () {
  closeModal();
};

// ポップアップを閉じて中身をリセットする共通の関数
function closeModal() {
  addTaskModal.classList.add("hidden");
  taskInput.value = "";
  taskDate.value = "";
  taskPriority.value = "medium"; // 初期値を「重要（青）」に合わせておくと親切じゃ
}

// ==========================================
// 3. タスクを追加する処理（サーバー送信の補助）
// ==========================================

// フォームが送信（submit）される瞬間に実行する処理
todoForm.onsubmit = function () {
  // 送信が始まったら、とりあえずポップアップを閉じる処理だけをしておくのじゃ
  // （HTMLに required をつけたので、空っぽの時はブラウザが自動で送信を止めて警告してくれます）
  addTaskModal.classList.add("hidden");

  // ★ ここで e.preventDefault() を書かないのが最大のポイント！
  // これにより、そのままデータが index.ts の /todos 窓口へ送信されます。
};
