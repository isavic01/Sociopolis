import { db, auth } from "../../services/firebaseConfig";
import { useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";


export const AboutPanel = () => {
    const [reportText, setReportText] = useState("");
    const [status, setStatus] = useState("");

    async function handleReport() {
        const user = auth.currentUser;
        const trimmed = reportText.trim();
        const wordCount = trimmed === "" ? 0 : trimmed.split(/\s+/).length;
    
        if (wordCount === 0) {
          setStatus("Please write something");
          return;
        }
        if (wordCount > 500) {
          setStatus("Too long (max 500 words)");
          return;
        }
    
        try {
          await addDoc(collection(db, "suggestions"), {
            message: trimmed,
            wordCount,
            sourcePage: "landing",
            uid: user?.uid ?? null,
            email: user?.email ?? null,
            displayName: user?.displayName ?? null,
            createdAt: serverTimestamp(),
          });
          setReportText("");
          setStatus("Thank you for your suggestion!");
        } catch (err) {
          console.error("Error Submitting suggestion. Please try again later.", err);
          setStatus("Failed to submit");
        }
      }
    return (
    <div className="p-4 h-full overflow-y-auto relative">
        <div className="p-2 mb-6">
        <h3 className=""> about </h3>
        <p className="text-sm mb-6"> Learn how to play and provide suggestions! </p>
        <div className="bg-white rounded-lg justify-center">
            <h4 className="font-semibold text-center pt-2 mb-2">How to Play</h4>
            <ol className="list-decimal list-inside p-6 space-y-3 pb-10">
                <li>create an account</li>
                <li>select a house in the city to stat a lesson</li>
                <li>make progress and have fun</li>
                <li>customize your companion (character tab)</li>
                <li>invite your friends and compete on the leaderboard!</li>
                <li>suggest lesson ideas and improvements below</li>
            </ol>
        </div>
        <div className="mt-8 max-w-[600px]">
        <textarea
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          placeholder="Write your suggestion here (max 500 words)"
          rows={5}
          className="w-full border rounded p-2"
        />
        <button
          onClick={handleReport}
          className="w-full mt-2 bg-blue-500 text-white py-2 rounded"
        >
          Suggest
        </button>
        <p>{status}</p>
        <p>
          Word count:{" "}
          {reportText.trim() === ""
            ? 0
            : reportText.trim().split(/\s+/).length}
          /500
        </p>
      </div>
      </div>
    </div>
  );
};