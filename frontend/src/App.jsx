import { useState, useRef } from 'react';

function App() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isCameraStarted, setIsCameraStarted] = useState(false); // 状態管理を追加
  const [uploadStatus, setUploadStatus] = useState("");

  const API_URL = "192.168.3.18";

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
      <h2>カメラアプリ試作</h2>
      
      <div style={{ marginBottom: '10px' }}>
        {/* ステート(isCameraStarted)に基づいてボタンを出し分け */}
        {!isCameraStarted ? (
          <button onClick={startCamera} style={btnStyle}>カメラを起動</button>
        ) : (
          <button onClick={takePhoto} style={{...btnStyle, backgroundColor: 'red'}}>シャッター</button>
        )}
      </div>
    
      {/*画像を選択する*/}
      <div style={{ border: '1px solid #ddd'}}>
	  <p style={{ margin: '0 0 10px 0'}}>保存済み画像から選択</p>
	  画像を選択
	  <input type='file' accept="image/*" onChange={handleFileSelect} style={{ display: 'none'}} />
      </div>
	  
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        style={{ width: '100%', maxWidth: '400px', borderRadius: '8px', backgroundColor: '#000' }} 
      />

      {capturedImage && (
        <div style={{ marginTop: '20px' }}>
          <h3>撮影された写真</h3>
          <img src={capturedImage} alt="Captured" style={{ width: '100%', maxWidth: '400px', border: '2px solid #333' }} />
        
	<br />
	<button onClick={uploadImage} style={{...btnStyle, backgroudColor: '#28a745', marginTop: '10px'}}>
	      この写真をPCに保存
	      </button>
	      <p>{uploadStatus}</p>
	      </div>
      )}

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
};

export default App;

