import { useState, useRef } from 'react';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);

  // カメラを起動する
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" }, // 背面カメラを優先
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("カメラ起動エラー:", err);
      alert("カメラの起動に失敗しました。HTTPS接続か確認してください。");
    }
  };

  // シャッターを切る（現在のビデオフレームを画像として取得）
  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      const context = canvas.getContext('2d');
      // ビデオのサイズに合わせてキャンバスを設定
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      // キャンバスに描画
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // 画像データ(Base64)を取得
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
    }
  };

  return (
    <div style={{ textAlign: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
      <h2>カメラアプリ試作</h2>

      <div style={{ marginBottom: '10px' }}>
        {!videoRef.current?.srcObject ? (
          <button onClick={startCamera} style={btnStyle}>カメラを起動</button>
        ) : (
          <button onClick={takePhoto} style={{...btnStyle, backgroundColor: 'red'}}>シャッター</button>
        )}
      </div>

      {/* プレビュー映像 /}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        style={{ width: '100%', maxWidth: '400px', borderRadius: '8px', backgroundColor: '#000' }} 
      />

      {/ 撮影した写真の表示 /}
      {capturedImage && (
        <div style={{ marginTop: '20px' }}>
          <h3>撮影された写真</h3>
          <img src={capturedImage} alt="Captured" style={{ width: '100%', maxWidth: '400px', border: '2px solid #333' }} />
          <p>※このデータをPythonへ送る準備ができました</p>
        </div>
      )}

      {/ 非表示のキャンバス（画像処理用） */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

const btnStyle = {
  padding: '12px 24px',
  fontSize: '16px',
  color: 'white',
  backgroundColor: '#007bff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default App;
