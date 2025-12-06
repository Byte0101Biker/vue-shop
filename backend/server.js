import express from "express";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";

const app = express();
const PORT = 3000;

// 📁 Pliki danych
const USERS_FILE = "./users.json";
const SETTINGS_FILE = "./settings.json";
const ORDERS_FILE = "./orders.json";
const UPLOADS_DIR = "./uploads";

// 🧩 Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// 📦 Upewnij się, że foldery istnieją
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// 📤 Konfiguracja uploadu plików
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, Date.now() + "-" + safeName);
  },
});
const upload = multer({ storage });

// 🧱 Tworzenie plików startowych, jeśli nie istnieją
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(
    USERS_FILE,
    JSON.stringify([{ email: "admin@local", password: "admin123", role: "admin" }], null, 2)
  );
}

if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(
    SETTINGS_FILE,
    JSON.stringify(
      {
        title: "Sklep z koszulkami 👕",
        subtitle: "Wybierz styl, który pasuje do Ciebie",
        theme: {
          bannerColor: "#41b883",
          accentColor: "#35495e",
          fontFamily: "'Inter', sans-serif",
        },
        products: [
          {
            id: 1,
            name: "Koszulka Vue Classic",
            description: "Bawełniana koszulka z logo Vue.js",
            price: 89,
            color: "#41b883",
            image: "",
          },
          {
            id: 2,
            name: "Koszulka Dark Mode",
            description: "Stylowa czarna koszulka z nadrukiem",
            price: 99,
            color: "#222222",
            image: "",
          },
        ],
        pages: {
          about: "Jesteśmy pasjonatami technologii i dobrego designu.",
          contact: "📧 sklep@vueshop.local | 📞 123 456 789",
        },
      },
      null,
      2
    )
  );
}

if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, JSON.stringify([], null, 2));
}

// 🧾 Dodanie nowego zamówienia
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
    console.error(err);
    res.status(500).json({ message: "❌ Błąd zapisu zamówienia" });
  }
});

// 📜 Pobranie wszystkich zamówień (dla admina)
app.get("/api/orders", (req, res) => {
  try {
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8"));
    res.json(orders);
  } catch {
    res.status(500).json({ message: "❌ Błąd odczytu zamówień" });
  }
});

// ❌ Usunięcie zamówienia (dla admina)
app.delete("/api/orders/:id", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let orders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8"));
    orders = orders.filter((o) => o.id !== id);
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    res.json({ message: "🗑️ Zamówienie usunięte" });
  } catch {
    res.status(500).json({ message: "❌ Błąd przy usuwaniu zamówienia" });
  }
});

// 🔐 Logowanie użytkownika
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  try {
    const users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
    const user = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!user) return res.status(401).json({ message: "Nieprawidłowy email lub hasło" });
    res.json({ message: "✅ Zalogowano pomyślnie", user });
  } catch {
    res.status(500).json({ message: "❌ Błąd logowania" });
  }
});

// 📦 Dane sklepu (ustawienia)
app.get("/api/settings", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf8"));
    res.json(data);
  } catch {
    res.status(500).json({ message: "❌ Błąd odczytu ustawień" });
  }
});

// 💾 Zapis ustawień (dla admina)
app.post("/api/settings", (req, res) => {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(req.body, null, 2));
    res.json({ message: "✅ Zapisano zmiany!" });
  } catch {
    res.status(500).json({ message: "❌ Błąd zapisu ustawień" });
  }
});

// 📸 Upload zdjęć produktów
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Nie przesłano pliku" });
  }
  res.json({ url: `http://localhost:${PORT}/uploads/${req.file.filename}` });
});

// 📜 Zamówienia konkretnego użytkownika
app.get("/api/orders/user/:email", (req, res) => {
  try {
    const email = req.params.email?.toLowerCase();
    if (!email) {
      return res.status(400).json({ message: "Brak adresu e-mail" });
    }
    const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, "utf8"));
    const userOrders = orders.filter(
      (o) => o.email?.toLowerCase() === email
    );
    res.json(userOrders);
  } catch {
    res.status(500).json({ message: "❌ Błąd odczytu zamówień użytkownika" });
  }
});

// 🏁 Start serwera
app.listen(PORT, () => console.log(`✅ Backend działa na http://localhost:${PORT}`));