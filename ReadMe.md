# 🌙 Ramadhan Companion App

## 📖 Overview
The **Ramadhan Companion App** is a web-based platform designed to assist Muslims during **Ramadhan** by providing:
- 📅 **Daily prayer times** based on precise astronomical calculations.
- 📖 **Quranic reading plans** to help users complete the Quran within 30 days.
- 🕌 **Fasting schedule tracking** including **Imsak and Iftar** times.
- 📌 **Location-based adjustments** for accurate prayer times.
- 🔐 **Secure authentication** and **profile management**.

This app is built with **NestJS, MongoDB, Docker, and external APIs** to ensure **scalability, accuracy, and real-time updates**.

---

## ⚡ Features
✔️ **Dynamic prayer time calculations** using astronomy-based computations.  
✔️ **Hijri-Gregorian date conversion** for accurate scheduling.  
✔️ **Quran recitation tracking** with automated progress marking.  
✔️ **User authentication** with JWT-based security.  
✔️ **Fasting schedule with real-time countdowns** to Imsak and Iftar.  
✔️ **Fully containerized with Docker** for easy deployment.  

---

## 🏗️ System Architecture
The application follows a **modular architecture** with the following key components:

### **🔹 Backend (NestJS)**
- **AuthService** → Handles user authentication and JWT token management.
- **QuranService** → Manages Quranic data and recitation tracking.
- **PrayersService** → Computes prayer times dynamically.
- **AstronomyService** → Calculates solar declination and time offsets.
- **RamadanService** → Generates the complete fasting schedule.
- **DateParserService** → Converts and formats Hijri-Gregorian dates.

### **🔹 Frontend (Handlebars & Tailwind CSS)**
- **Dynamic prayer tracking** with real-time updates.
- **Quran reading dashboard** based on user progress.
- **Location-based schedule adjustments**.

### **🔹 Database**
- **MongoDB** stores user credentials, prayer schedules, and Quran tracking data.

### **🔹 APIs Used**
- 📖 **Quran API**: [alquran.cloud](https://alquran.cloud/api)
- 🌍 **OpenStreetMap API**: [Nominatim Reverse Geocoding](https://nominatim.org/)
- 🕌 **IslamicFinder Prayer Times**: [islamicfinder.org](https://www.islamicfinder.org/)
- 📆 **Hijri Date Converter**: [Hijri-Converter GitHub](https://github.com/xsoh/hijri-converter)
- 🌍 **IP Geolocation API**: [IpInfo](http://ipinfo.io)

---

## 🚀 Installation & Setup

### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/your-username/Ramadhan-Companion-App.git
cd Ramadhan-Companion-App
```

### **2️⃣ Install Dependencies**
```sh
npm install
```

### **3️⃣ Set Up Environment Variables**
Create a `.env` file in the root directory and configure:
```
MONGO_URI=mongodb://localhost:27017/ramadhan_db
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### **4️⃣ Start the Application**
```sh
npm run start
```

### **5️⃣ Run the App in Docker (Optional)**
```sh
docker-compose up --build
```

---

## 🔌 API Endpoints

### **🛡️ Authentication API**
| Method | Endpoint       | Description               |
|--------|--------------|---------------------------|
| `POST` | `/login`     | User login               |
| `POST` | `/register`  | User registration        |
| `GET`  | `/profile`   | Fetch user profile       |
| `POST` | `/profile`   | Update user profile      |
| `GET`  | `/logout`    | Logout user              |

### **📖 Quran API**
| Method | Endpoint          | Description                  |
|--------|-----------------|------------------------------|
| `GET`  | `/quran`        | Fetch today's Quran plan    |
| `PATCH`| `/api/mark-ayah`| Mark last read Ayah        |

### **🕌 Prayer API**
| Method | Endpoint             | Description                     |
|--------|---------------------|---------------------------------|
| `GET`  | `/ramadan-schedule` | Fetch prayer times for Ramadhan |

---

## 🎯 Future Enhancements
- 🔔 **Real-time prayer alerts and notifications**.
- 📱 **Progressive Web App (PWA) support**.
- 🌍 **Multi-language support for a global audience**.
- 📊 **User analytics for prayer and Quran recitation tracking**.

---

## 💡 Contributions & Acknowledgments
This project was developed as part of the **Web Services Course** at **Tunis Business School**. Special thanks to **IslamicFinder.org** and **OpenStreetMap API** for providing accurate data sources.


