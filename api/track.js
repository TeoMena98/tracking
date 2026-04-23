export default async function handler(req, res) {
  const id = req.query.id || "desconocido";

  // IP real
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0].trim() ||
    req.headers["x-real-ip"] ||
    "no-ip";

  const fecha = new Date().toISOString();

  const log = `ID: ${id} | IP: ${ip} | Fecha: ${fecha}\n`;

  // 🔐 Variables (desde Vercel)
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const OWNER = "TeoMena98";
  const REPO = "tracking";
  const PATH = "logs.txt";

  try {
    // 1. Obtener archivo actual
    const getFile = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json"
        }
      }
    );

    let content = "";
    let sha = null;

    if (getFile.status === 200) {
      const data = await getFile.json();
      content = Buffer.from(data.content, "base64").toString("utf-8");
      sha = data.sha;
    }

    const newContent = content + log;

    // 2. Subir archivo actualizado
    await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "update logs",
          content: Buffer.from(newContent).toString("base64"),
          sha
        })
      }
    );

    console.log(log);

    res.status(200).send("OK");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error");
  }
}
