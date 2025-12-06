🛍️ Vue Shop — Sklep internetowy (Vue + Node)

Pełny projekt sklepu online z panelem administratora.
Frontend działa na GitHub Pages, a backend API na Render.com.

🔗 Demo
Frontend: https://byte0101biker.github.io/vue-shop/
Backend API: https://vue-shop-u098.onrender.com

🚀 Funkcje
Frontend (Vue 3)
	•	Wyświetlanie produktów
	•	Dynamiczny wygląd na podstawie ustawień API
	•	Koszyk i składanie zamówień
	•	Logowanie administratora
	•	Panel admina: ustawienia sklepu, zamówienia, upload zdjęć

Backend (Node + Express)
	•	API oparte na plikach JSON
	•	Obsługa zamówień
	•	Logowanie użytkowników
	•	Upload zdjęć (multer)
	•	Endpointy:
	•	GET/POST /api/settings
	•	POST /api/login
	•	POST /api/order
	•	GET /api/orders
	•	DELETE /api/orders/:id

  ▶️ Uruchomienie lokalnie
Backend
**cd backend
npm install
node server.js**

Frontend
**npm install
npm run dev**

🔐 Dane administratora
**email: admin@local
hasło: admin123**

📁 Struktura projektu
**backend/
  server.js
  users.json
  settings.json
  orders.json
  uploads/

src/
  components/
  views/
  router/
  store/**

📄 Licencja

**Projekt udostępniony na licencji MIT.**


