import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";

const app = express();
const PORT = process.env.PORT || 3000; // ✔️ Render wymaga tego

// Absolutne ścieżki do plików JSON
const BASE_DIR = path.resolve("./backend"); // backend folder
const USERS_FILE = path.join(BASE_DIR, "users.json");
const SETTINGS_FILE = path.join(BASE_DIR, "settings.json");
const ORDERS_FILE = path.join(BASE_DIR, "orders.json");
const UPLOADS_DIR = path.join(BASE_DIR, "uploads");

// Middleware
app.use(cors());
app.use(bodyParser.json());

// statyczne pliki (Render)
app.use("/uploads", express.static(UPLOADS_DIR));

// Upewnij się, że katalog istnieje
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Upload plików
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// Tworzenie plików startowych
function ensureFile(file, defaultContent) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(defaultContent, null, 2));
  }
}

ensureFile(USERS_FILE, [{ email: "admin@local", password: "admin123", role: "admin" }]);
ensureFile(SETTINGS_FILE, {
  title: "Sklep z koszulkami 👕",
  subtitle: "Wybierz styl, który pasuje do Ciebie",
  theme: {
    bannerColor: "#41b883",
    accentColor: "#35495e",
    fontFamily: "'Inter', sans-serif",
  },
  products: [],
  pages: { about: "", contact: "" },
});
ensureFile(ORDERS_FILE, []);

// API endpoints jak u Ciebie…

// Upload — poprawiony URL!
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "Nie przesłano pliku" });

  const publicUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

  res.json({ url: publicUrl });
});

app.listen(PORT, () =>
  console.log(`Backend działa na porcie ${PORT}`)
);
