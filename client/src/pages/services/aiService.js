import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/api/ai`;

export async function sendMessage(message) {
  const { data } = await axios.post(`${API}/chat`, {
    message,
  });

  return data.reply;
}
