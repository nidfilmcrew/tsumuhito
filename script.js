import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
  "https://hrtuyjkbchlkxzkzltak.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhydHV5amtiY2hsa3h6a3psdGFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NTc3NTQsImV4cCI6MjA3MDAzMzc1NH0.mShgkdKTBUBQA9M4YeVQUjEnLlpOXwBhShRJ-bGC-BM"
);

const bucketName = "images";

// 要素取得
const fileInput = document.getElementById("file-input");
const uploadBtn = document.getElementById("upload-btn");
const statusDiv = document.getElementById("status");
const imageListDiv = document.getElementById("image-list");
const nicknameInput = document.getElementById("nickname");
const titleInput = document.getElementById("title");
const modal = document.getElementById("uploadModal");
const plusBtn = document.getElementById("plusButton");

// モーダル開閉
if (plusBtn) {
  plusBtn.addEventListener("click", () => {
    modal.style.display = "flex";
  });
}

function closeModalOnOutsideTap(e) {
  if (e.target === modal) {
    modal.style.display = "none";
  }
}
window.addEventListener("click", closeModalOnOutsideTap);
window.addEventListener("touchstart", closeModalOnOutsideTap);

// JPEG変換
async function convertToJpeg(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            resolve(
              new File(
                [blob],
                file.name.replace(/\.[^/.]+$/, "") + ".jpg",
                { type: "image/jpeg" }
              )
            );
          },
          "image/jpeg",
          0.8
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

// アップロード処理
if (uploadBtn) {
  uploadBtn.addEventListener("click", async () => {
    let file = fileInput.files[0];
    const nickname = nicknameInput.value.trim();
    const title = titleInput.value.trim();

    if (!file || !nickname || !title) {
      statusDiv.textContent = "すべての項目を入力してください。";
      return;
    }

    if (!file.type.includes("jpeg") && !file.type.includes("jpg")) {
      statusDiv.textContent = "画像を変換中…";
      file = await convertToJpeg(file);
    }

    const fileName = `${Date.now()}_${file.name}`;
    statusDiv.textContent = "アップロード中…";

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file);

    if (uploadError) {
      statusDiv.textContent = `アップロード失敗: ${uploadError.message}`;
      return;
    }

    const { error: insertError } = await supabase
      .from("posts")
      .insert([{ title: title, nickname: nickname, image_name: fileName }]);

    if (insertError) {
      console.error("INSERTエラー", insertError);
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
}

// 画像ロード
async function loadImages(limit = null) {
  imageListDiv.innerHTML = "";

  let query = supabase.from("posts").select("*").order("id", { ascending: false });
  if (limit) query = query.limit(limit);

  const { data, error } = await query;

  if (error) {
    statusDiv.textContent = `投稿一覧の取得失敗: ${error.message}`;
    return;
  }

  for (const post of data) {
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(post.image_name);

    const wrapper = document.createElement("div");
    wrapper.className = "image-item";

    const img = document.createElement("img");
    img.src = urlData.publicUrl;
    img.alt = post.title;

    img.onload = () => {
      img.classList.add("loaded");
    };

    const info = document.createElement("div");
    info.className = "info";
    info.innerHTML = `
      <span class="title">${post.title}</span>
      <span class="nickname">${post.nickname}</span>
    `;

    wrapper.appendChild(img);
    wrapper.appendChild(info);
    imageListDiv.appendChild(wrapper);
  }
}

// ローディング画面制御
window.addEventListener("load", () => {
  const loadingScreen = document.getElementById("loading-screen");

  // ギャラリー読み込み
  if (imageListDiv) {
    if (window.location.pathname.includes("gallery")) {
      loadImages(); // 全部
    } else {
      loadImages(6); // ホームは6件だけ
    }
  }

  // ローディング画面を消す
  if (loadingScreen) {
    setTimeout(() => {
      loadingScreen.classList.add("hidden");
      loadingScreen.addEventListener("transitionend", () => {
        loadingScreen.style.display = "none";
      });
    }, 6000);
  }
});