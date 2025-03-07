import React, { useState } from "react";

const App: React.FC = () => {
  const [videoId, setVideoId] = useState("");

  const handleDownload = () => {
    if (!videoId) {
      alert("Por favor, insira um ID de vídeo.");
      return;
    }
    fetch(`/api/download?id=${videoId}`)
      .then((response) => {
        if (response.ok) {
          return response.blob();
        }
        throw new Error("Erro ao baixar o vídeo.");
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${videoId}.mp4`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((error) => {
        console.error(error);
        alert("Erro ao baixar o vídeo.");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Baixar Vídeo do YouTube</h1>
      <input
        type="text"
        value={videoId}
        onChange={(e) => setVideoId(e.target.value)}
        placeholder="Insira o ID do vídeo"
        className="p-2 border border-gray-300 rounded mb-4"
      />
      <button
        onClick={handleDownload}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Baixar Vídeo
      </button>
    </div>
  );
};

export default App;
