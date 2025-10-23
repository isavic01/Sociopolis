import { useState } from 'react'
import { HamburgerButton } from '../components/hamburgerbutton'
import { SideMenu } from '../components/sidemenu'
//temp place for reports header
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../../services/firebaseConfig";
import { Background } from '../components/background';
// import { REGIONS } from './RegionDefs';
// import { useEffect } from 'react';
// import { useProgressStore } from '@/features/progress/progressStore'; /Users/isabelhernandez/Desktop/sociopolis/FrontEnd/src/features/progress/progressStore.ts
// import { Hotspot } from './Hotspot';


export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  //temp place for the reports
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


  

  return (
    <div className="side-menu">
      <HamburgerButton onClick={() => setMenuOpen(!menuOpen)} />
      <SideMenu isOpen={menuOpen} />
      <Background/>
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
