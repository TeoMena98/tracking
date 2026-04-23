import fs from "fs";

export default function handler(req, res) {
  // ID que viene en la URL (?id=AB, etc.)
  const id = req.query.id || "desconocido";

  // Obtener IP real en Vercel
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.headers["x-real-ip"] ||
    "no-ip";

  const fecha = new Date().toISOString();

  const log = `ID: ${id} | IP: ${ip} | Fecha: ${fecha}\n`;

  // Guardado temporal (solo pruebas)
  try {
    fs.appendFileSync("/tmp/logs.txt", log);
  } catch (err) {
    console.error("Error guardando:", err);
  }

  // Log visible en Vercel
  console.log(log);

  res.status(200).json({ ok: true });
}