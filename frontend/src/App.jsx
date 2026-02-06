import { useState, useRef } from 'react';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraStarted, setIsCameraStarted] = useState(false); // 状態管理を追加
  const [uploadStatus, setUploadStatus] = useState("");

  const API_URL = "keiba-backend";

  // カメラを起動する
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraStarted(true); // 起動成功を記録
      }
    } catch (err) {
      console.error("カメラ起動エラー:", err);
      alert("カメラの許可が必要です");
    }
  };

  // シャッターを切る
  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas && video.videoWidth > 0) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = canvas.toDataURL('image/jpeg');
      setCapturedImage(imageData);
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setCaputuredImage(e.target.result);
      setUploadStatus("画像を選択。送信ボタンを押して");
    };
    reader.readAsDataURL(file);
  }
		

  const uploadImage = async () => {
    if (!capturedImage) return;
	  setUploadStatus("送信中");

	  try {
	    const blob = await (await fetch(capturedImage)).blob();
            const formData = new FromData();
            formData.append('file', blob, 'capture.jpg');

            const response = await fetch(API_URL, {
              method: POST,
              body: formData,
	    });

	    if (response.ok) {
              setUploadStatus("Success");
	    } else {
              setUploadStatus("fail");
	    }
	  } catch(err) {
            console.erorr(err);
	    setUploadStatus("error");
	  }	  
  }

return (
    <div style={{ textAlign: 'center', fontFamily: 'sans-serif', padding: '20px' }}>
      <h2>画像送信アプリ</h2>
      
      {/* 選択ボタンのレイアウト */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center', marginBottom: '20px' }}>
        
        {/* カメラセクション */}
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '10px', width: '100%', maxWidth: '300px' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>リアルタイム撮影</p>
          {!isCameraStarted ? (
            <button onClick={startCamera} style={btnStyle}>カメラを起動</button>
          ) : (
            <button onClick={takePhoto} style={{...btnStyle, backgroundColor: 'red'}}>シャッター</button>
          )}
        </div>

        {/* ファイル選択セクション */}
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '10px', width: '100%', maxWidth: '300px' }}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>保存済み画像から選択</p>
          <label style={{...btnStyle, backgroundColor: '#6c757d', display: 'inline-block', cursor: 'pointer' }}>
            画像を選択
            <input type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      <video ref={videoRef} autoPlay playsInline style={videoStyle} />

      {capturedImage && (
        <div style={{ marginTop: '20px', borderTop: '2px solid #eee', paddingTop: '20px' }}>
          <img src={capturedImage} alt="Preview" style={{ width: '100%', maxWidth: '300px', borderRadius: '5px' }} />
          <br />
          <button onClick={uploadImage} style={{...btnStyle, backgroundColor: '#28a745', marginTop: '10px', width: '100%', maxWidth: '300px'}}>
            この画像をPCに送信
          </button>
          <p style={{ fontWeight: 'bold' }}>{uploadStatus}</p>
        </div>
      )}

      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
}

const btnStyle = { padding: '12px 24px', fontSize: '14px', color: 'white', border: 'none', borderRadius: '8px', borderBottom: '3px solid rgba(0,0,0,0.2)' };
const videoStyle = { width: '100%', maxWidth: '400px', borderRadius: '8px', backgroundColor: '#000', display: 'block', margin: '0 auto' };

export default App;
