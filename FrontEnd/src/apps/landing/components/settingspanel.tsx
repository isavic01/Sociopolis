import { useState } from 'react'
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../services/firebaseConfig";

export default function SettingsPanel() {
  const [reportText, setReportText] = useState("");
  const [status, setStatus] = useState("");

  async function handleReport() {
    const user = auth.currentUser;
    const trimmed = reportText.trim();
    const wordCount = trimmed === "" ? 0 : trimmed.split(/\s+/).length;

    if (wordCount === 0) {
      setStatus("please write something");
      return;
    }
    if (wordCount > 500) {
      setStatus("too long (max 500 words)");
      return;
    }

    try {
      await addDoc(collection(db, "reports"), {
        message: trimmed,
        wordCount,
        sourcePage: "landing",
        uid: user?.uid ?? null,
        email: user?.email ?? null,
        displayName: user?.displayName ?? null,
        createdAt: serverTimestamp(),
      });
      setReportText("");
      setStatus("success");
    } catch (err) {
      console.error("error submitting report", err);
      setStatus("failed to submit");
    }
  }

  // 👇 You need to return JSX here
  return (
    <div className="panel-content">
      <h3 className="subheading">Settings</h3>
      {/* Settings content here */}
      <div className="mt-8 max-w-[600px]">
        <textarea
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          placeholder="write your feedback/report here (max 500 words)"
          rows={5}
          className="w-full border rounded p-2"
        />
        <button
          onClick={handleReport}
          className="w-full mt-2 bg-blue-500 text-white py-2 rounded"
        >
          Report to Developer
        </button>
        <p>{status}</p>
        <p>
          Word count:{" "}
          {reportText.trim() === "" ? 0 : reportText.trim().split(/\s+/).length}/500
        </p>
      </div>
    </div>
  );
}