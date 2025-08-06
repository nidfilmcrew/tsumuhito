<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>摘む人</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 100%;
      margin: 0;
      padding-bottom: 80px;
    }

    h1 {
      text-align: center;
      margin-top: 1em;
    }

    #image-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1em;
      padding: 1em;
    }

    .image-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .image-item img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
    }

    .image-item .info {
      text-align: center;
      font-size: 0.9em;
      margin-top: 0.3em;
    }

    #uploadModal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.5);
      justify-content: center;
      align-items: center;
    }

    #uploadModalContent {
      background: white;
      padding: 1em;
      border-radius: 10px;
      width: 90%;
      max-width: 400px;
    }

    #plusButton {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      font-size: 2em;
      cursor: pointer;
      box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    }

    input[type="text"], input[type="file"] {
      width: 100%;
      margin: 0.5em 0;
    }

    #status {
      text-align: center;
      margin-top: 1em;
    }
  </style>
</head>
<body>

  <h1>摘む人</h1>

  <div id="image-list"></div>

  <div id="uploadModal">
    <div id="uploadModalContent">
      <label>ニックネーム：</label><br />
      <input type="text" id="nickname" placeholder="例：みーちゃん" /><br />
      <label>タイトル：</label><br />
      <input type="text" id="title" placeholder="例：昨日の空" /><br />
      <label>画像を選択：</label><br />
      <input type="file" id="file-input" accept="image/*" /><br />
      <button id="upload-btn">アップロード</button>
    </div>
  </div>

  <button id="plusButton">＋</button>

  <div id="status"></div>

  <script type="module">
    import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

    const supabase = createClient(
      "https://hrtuyjkbchlkxzkzltak.supabase.co",
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhydHV5amtiY2hsa3h6a3psdGFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NTc3NTQsImV4cCI6MjA3MDAzMzc1NH0.mShgkdKTBUBQA9M4YeVQUjEnLlpOXwBhShRJ-bGC-BM"
    );

    const bucketName = "images";

    const fileInput = document.getElementById("file-input");
    const uploadBtn = document.getElementById("upload-btn");
    const statusDiv = document.getElementById("status");
    const imageListDiv = document.getElementById("image-list");
    const nicknameInput = document.getElementById("nickname");
    const titleInput = document.getElementById("title");

    const modal = document.getElementById("uploadModal");
    const plusBtn = document.getElementById("plusButton");

    plusBtn.addEventListener("click", () => {
      modal.style.display = "flex";
    });

    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });

    uploadBtn.addEventListener("click", async () => {
      const file = fileInput.files[0];
      const nickname = nicknameInput.value.trim();
      const title = titleInput.value.trim();

      if (!file || !nickname || !title) {
        statusDiv.textContent = "すべての項目を入力してください。";
        return;
      }

      const fileName = `${Date.now()}_${file.name}`;

      statusDiv.textContent = "アップロード中…";

      // 画像ファイルをストレージにアップロード
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (uploadError) {
        statusDiv.textContent = `アップロード失敗: ${uploadError.message}`;
        return;
      }

      // postsテーブルに投稿情報を保存
      const { error: insertError } = await supabase
        .from("posts")
        .insert([
          {
            title: title,
            nickname: nickname,
            image_name: fileName,
          },
        ]);

      if (insertError) {
        statusDiv.textContent = `投稿情報の保存失敗: ${insertError.message}`;
        return;
      }

      modal.style.display = "none";
      fileInput.value = "";
      nicknameInput.value = "";
      titleInput.value = "";
      statusDiv.textContent = "アップロード＆保存完了！";

      loadImages();
    });

    async function loadImages() {
      statusDiv.textContent = "画像一覧を読み込み中…";

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        statusDiv.textContent = `投稿一覧の取得失敗: ${error.message}`;
        return;
      }

      imageListDiv.innerHTML = "";

      for (const post of data) {
        const { publicURL } = supabase.storage
          .from(bucketName)
          .getPublicUrl(post.image_name);

        const wrapper = document.createElement("div");
        wrapper.className = "image-item";

        const img = document.createElement("img");
        img.src = publicURL;
        img.alt = post.title;

        const info = document.createElement("div");
        info.className = "info";
        info.textContent = `${post.title}（投稿者: ${post.nickname}）`;

        wrapper.appendChild(img);
        wrapper.appendChild(info);
        imageListDiv.appendChild(wrapper);
      }

      statusDiv.textContent = "";
    }

    window.addEventListener("load", () => {
      loadImages();
    });
  </script>
</body>
</html>
