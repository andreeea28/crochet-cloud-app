const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const axios = require("axios");

app.post("/api/generate", async (req, res) => {
  const { title } = req.body;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Scrie o singura descriere scurta, clara si naturala, in limba romana, pentru un proiect de crosetat numit "${title}". 
Nu oferi variante. 
Nu folosi titluri, bullet points, markdown sau ghilimele. 
Raspunde doar cu descrierea finala, in maximum 2 propozitii.`,
              },
            ],
          },
        ],
      },
    );

    const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({
      description: text || "Nu s-a putut genera descrierea.",
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json(err.response?.data || { error: "AI failed" });
  }
});
