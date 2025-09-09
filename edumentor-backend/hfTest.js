import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const testHF = async () => {
  try {
    const res = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      { inputs: "Hello world. This is a test summary." },
      { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
    );
    console.log("HF API response:", res.data);
  } catch (err) {
    console.error("HF API error:", err.response?.data || err.message);
  }
};

testHF();
