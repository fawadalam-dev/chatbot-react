import { useState } from "react";
import "./App.css";
import axios from "axios";
import { SignedIn, SignInButton, SignOutButton } from "@clerk/clerk-react";
import { FaWhatsapp } from "react-icons/fa";

function App() {
  const [query, setQuery] = useState("");
  const [chatList, setChatList] = useState([]);

  const handleQuerySubmit = async (e) => {
    e.preventDefault();

    if (!query) return;

    try {

      setChatList((prev) => [...prev, { source: "user", text: query }]);

      const apiRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`,
        {
          contents: [
            {
              parts: [{ text: query }],
            },
          ],
        },
        {
          headers: {
            "x-goog-api-key": import.meta.env.VITE_GOOGLE_API_KEY,
            "Content-Type": "application/json",
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
      
      <FaWhatsapp />

      <SignInButton />
      <SignOutButton />
      <SignedIn>
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
      </SignedIn>

      {chatList.map((ms, idx) => (
        <div key={idx} className={`message ${ms.source}`}>
          <div>{ms.text}</div>
        </div>
      ))}
    </>
  );
}

export default App;