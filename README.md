# 📄 PDF Text Extractor

A **React + Node.js** web application that allows users to **upload a PDF**, **search for keywords**, and **view extracted text** from specific pages. The app supports both **regular search** and **smart contextualized search**.

---

## 🚀 Features

- 📁 **Upload PDF Files** (up to 16MB)
- 🔍 **Keyword Search** (comma-separated)
- 📄 **Page-by-Page Extraction**
- ✅ **Highlights Found Keywords**
- ❌ **Shows Keywords Not Found**
- 🌐 **Built with React, Express, and pdf.js**

---

## 📂 Project Structure
text-extractor-react/ ├── backend/ # Express Backend │ └── server.js │ ├── src/ # React Frontend │ ├── components/ │ │ ├── FileUploader.jsx # Handles file upload & search │ │ └── SearchResults.jsx # Displays extracted results │ ├── App.jsx │ ├── App.css │ └── main.jsx │ ├── public/ │ └── index.html │ ├── package.json ├── vite.config.js # Proxy for API calls └── README.md
