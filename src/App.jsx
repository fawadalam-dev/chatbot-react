import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [chatList, setChatList] = useState([]);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();

    if (!query) return;

    try {

      setChatList((prev) => [...prev, { source: "user", text: query }]);

      const apiRes = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_API_KEY",
        {
          contents: [
            {
              parts: [{ text: query }],
            },
          ],
        },
        {
          headers: {
            "x-goog-api-key": "AIzaSyC-u5n7OINijdBK32nM4VMHcYL6Iaq2L5g", "Content-Type": "application/json"
          },
        }
      );

      const aiText =
        apiRes.data.candidates[0].content.parts[0].text;


      setChatList((prev) => [
        ...prev,
        { source: "ai", text: aiText },
      ]);

      setQuery("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h1>Chatbot App</h1>

      <form onSubmit={handleQuerySubmit}>
        <input
          type="text"
          placeholder="Ask something..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded ml-2"
        >
          Submit
        </button>
      </form>

      {chatList.map((ms) => (
        <div className={`message ${ms.source}`}>
          <div>{ms.text}</div>
        </div>
      ))}
    </>
  );
}

export default App;