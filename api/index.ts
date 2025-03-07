import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import ytdl from "@distube/ytdl-core";

const app = express();
const port = process.env.PORT || 3001;

// Determina o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve os arquivos estáticos do build do React
app.use(express.static(path.join(__dirname, "../../dist")));

// Rota para download de vídeo do YouTube
app.get("/api/download", async (req, res) => {
  const videoId = req.query.id as string;
  if (!videoId) {
    return res.status(400).send("O ID do vídeo é necessário");
  }

  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  try {
    const info = await ytdl.getInfo(videoUrl);
    const title = info.videoDetails.title.replace(/[^\w\s]/gi, "");

    res.header("Content-Disposition", `attachment; filename="${title}.mp4"`);

    ytdl(videoUrl, {
      filter: "audioandvideo",
      quality: "highest",
    }).pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao processar o download");
  }
});

// Para todas as outras rotas, retorna o index.html do React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../dist", "index.html"));
});

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
