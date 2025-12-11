import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";

const app = express();
const PORT = process.env.PORT || 10000;

// __dirname w ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 📁 Bazowy katalog backendu
const BASE_DIR = __dirname;

const USERS_FILE = path.join(BASE_DIR, "users.json");
const SETTINGS_FILE = path.join(BASE_DIR, "settings.json");
const ORDERS_FILE = path.join(BASE_DIR, "orders.json");
const UPLOADS_DIR = path.join(BASE_DIR, "uploads");

//  Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static(UPLOADS_DIR));

//  Upewnij się, że folder uploads istnieje
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

//  Konfiguracja uploadu plików
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

//  Tworzenie plików startowych
function ensureFile(file, defaultValue) {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(defaultValue, null, 2));
  }
}

//  Użytkownicy
ensureFile(USERS_FILE, [
  { email: "admin@local", password: "admin123", role: "admin" },
]);

//  Ustawienia sklepu
ensureFile(
  SETTINGS_FILE,
  {
    title: "Sklep z koszulkami 👕",
    subtitle: "Wybierz styl, który pasuje do Ciebie",
    theme: {
      bannerColor: "#41b883",
      accentColor: "#35495e",
      fontFamily: "'Inter', sans-serif",
    },
    products: [],
    pages: { about: "", contact: "" },
  }
);

ensureFile(ORDERS_FILE, []);

// ===================== API ===================== //

//  Dodanie nowego zamówienia
app.post("/api/order", (req, res) => {
  try {
    const order = req.body;
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8"));
    order.id = Date.now();
    order.date = new Date().toLocaleString("pl-PL");
    orders.push(order);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    res.json({ message: "✅ Zamówienie zapisane!" });
  } catch (err) {
    console.error("Błąd zapisu zamówienia:", err);
    res.status(500).json({ message: "❌ Błąd zapisu zamówienia" });
  }
});

//  Pobranie wszystkich zamówień (ADMIN)
app.get("/api/orders", (req, res) => {
  try {
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8"));
    res.json(orders);
  } catch (err) {
    console.error("Błąd odczytu zamówień:", err);
    res.status(500).json({ message: "❌ Błąd odczytu zamówień" });
  }
});

//  Logowanie użytkownika
app.post("/api/login", (req, res) => {
  try {
    const { email, password } = req.body;
    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) {
      return res.status(401).json({ message: "Błędne dane logowania" });
    }
    res.json({ message: "OK", user });
  } catch (err) {
    console.error("Błąd logowania:", err);
    res.status(500).json({ message: "❌ Błąd logowania" });
  }
});

//  Dane sklepu (ustawienia)
app.get("/api/settings", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"));
    res.json(data);
  } catch (err) {
    console.error("Błąd odczytu ustawień:", err);
    res.status(500).json({ message: "❌ Błąd odczytu ustawień" });
  }
});

//  Zapis ustawień (dla Admina)
app.post("/api/settings", (req, res) => {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(req.body, null, 2));
    res.json({ message: "✅ Zapisano zmiany!" });
  } catch (err) {
    console.error("Błąd zapisu ustawień:", err);
    res.status(500).json({ message: "❌ Błąd zapisu ustawień" });
  }
});

//  Upload zdjęcia produktu
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Brak pliku" });
  }

  const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.json({ url });
});

//  Zamówienia konkretnego użytkownika
app.get("/api/orders/user/:email", (req, res) => {
  try {
    const email = (req.params.email || "").toLowerCase();
    if (!email) {
      return res.status(400).json({ message: "Brak adresu e-mail" });
    }
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8"));
    const userOrders = orders.filter(
      (o) => (o.email || "").toLowerCase() === email
    );
    res.json(userOrders);
  } catch (err) {
    console.error("Błąd odczytu zamówień użytkownika:", err);
    res.status(500).json({ message: "❌ Błąd odczytu zamówień użytkownika" });
  }
});

//  PING — wybudzanie backendu przez frontend
app.get("/api/ping", (req, res) => {
  res.status(200).send("pong");
});

// 🏁 Start serwera
app.listen(PORT, () => {
  console.log(`✅ Backend działa na porcie ${PORT}`);
});
