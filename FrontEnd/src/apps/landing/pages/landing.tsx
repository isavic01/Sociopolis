import { useState } from 'react'
import { HamburgerButton } from '../components/hamburgerbutton'
import { SideMenu } from '../components/sidemenu'
//temp place for reports header
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../services/firebaseConfig";


export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  //temp place for the reports
  const [reportText, setReportText] = useState("");
  const [status, setStatus] = useState("");
  
async function handleReport() {
  const user = auth.currentUser;

  if (!user) {
    setStatus("login first");
    return;
  }

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
      text: trimmed,
      wordCount,
      uid: user.uid,
      createdAt: serverTimestamp(),
    });
    setReportText("");
    setStatus("success");
  } catch (err) {
    console.error("error submitting report", err);
    setStatus("failed to submit");
  }
}

  

  return (
    <div className="side-menu">
      <HamburgerButton onClick={() => setMenuOpen(!menuOpen)} />
      <SideMenu isOpen={menuOpen} />
      {/* Main landing content */}
      <div style={{ marginTop: "30px", maxWidth: "600px" }}>
      <textarea
        value={reportText}
        onChange={(e) => setReportText(e.target.value)}
        placeholder="write your feedback/report here (max 500 words)"
        rows={5}
        style={{ width: "100%" }}
      />
      <button onClick={handleReport} style={{ width: "100%", marginTop: "8px" }}>
        Report to Developer
      </button>
      <p>{status}</p>
      <p>
        Word count: {reportText.trim() === "" ? 0 : reportText.trim().split(/\s+/).length}/500
      </p>
    </div>
    </div>
  )
}
