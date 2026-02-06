from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid

app = FastAPI()

# --- CORS設定 ---
# React (Port 3000) からのアクセスを許可します
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 開発時はすべて許可。ngrok経由でも届くようになります
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 画像を保存するディレクトリ
UPLOAD_DIR = "storage"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Python API is running"}

@app.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    # ユニークなファイル名を生成して保存（重複防止）
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    try:
        # ファイルを読み取ってPC（storageフォルダ）に書き込み
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
        
        print(f"Saved: {file_path}") # コンテナのログに表示
        
        return {
            "status": "success",
            "filename": unique_filename,
            "path": file_path
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
