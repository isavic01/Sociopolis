import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  deleteDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { db, auth } from "../../services/firebaseConfig";
import { awardXP } from "../../services/xpService";

export default function SettingsPanel() {
  const [reportText, setReportText] = useState("");
  const [status, setStatus] = useState("");
  const [deleteStatus, setDeleteStatus] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [xpAmount, setXpAmount] = useState("");
  const [xpStatus, setXpStatus] = useState("");

  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setIsAdmin(userDoc.data().admin || false);
          }
        } catch (err) {
          console.error("Error checking admin status:", err);
        }
      }
    };
    checkAdminStatus();
  }, []);

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
      setStatus("Thank you for your report!");
    } catch (err) {
      console.error("Error Submitting Report. Please try again later.", err);
      setStatus("Failed to submit");
    }
  }

  

  async function handleAwardXP() {
    const user = auth.currentUser;
    const amount = parseInt(xpAmount);

    if (!user) {
      setXpStatus("no user signed in");
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      setXpStatus("please enter a valid number");
      return;
    }

    try {
      const newXP = await awardXP(user.uid, amount);
      setXpAmount("");
      setXpStatus(`success new xp is: ${newXP}`);
    } catch (err) {
      console.error("error awarding xp:", err);
      setXpStatus("failed to award xp");
    }
  }



  async function handleDeleteAccount() {
    const user = auth.currentUser;
    if (!user) {
      setDeleteStatus("No user is signed in.");
      return;
    }

    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      setDeleteStatus("Your account has been permanently deleted.");
      setShowDeleteModal(false);
    } catch (err: any) {
      console.error("Error deleting account:", err);
      if (err.code === "auth/requires-recent-login") {
        setDeleteStatus("Please reauthenticate to delete your account.");
      } else {
        setDeleteStatus("Failed to delete account.");
      }
    }
  }

  return (
    <div className="panel-content relative">
      <h3 className="subheading">Settings</h3>

      {/* Slide Toggles */}
      <div className="mt-4 mb-6 max-w-[600px] space-y-4">
        {/* TTS Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Text-to-Speech</span>
          <button
            onClick={() => setTtsEnabled(!ttsEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              ttsEnabled ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                ttsEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>

        </div>

        {/* Music Toggle */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700">Music</span>
          <button
            onClick={() => setMusicEnabled(!musicEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition  ${
              musicEnabled ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                musicEnabled ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Feedback Report */}
      <div className="mt-8 max-w-[600px]">
        <textarea
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          placeholder="Write your feedback/report here (max 500 words)"
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
          {reportText.trim() === ""
            ? 0
            : reportText.trim().split(/\s+/).length}
          /500
        </p>
      </div>

      

      {/* award xp */}
      {isAdmin && (
        <div className="mt-8 max-w-[600px] border-t pt-6">
          <h4 className="text-lg font-semibold mb-2">give xp(admin)</h4>
          <div className="flex gap-2">
            <input
              type="number"
              value={xpAmount}
              onChange={(e) => setXpAmount(e.target.value)}
              placeholder="enter xp amount"
              className="flex-1 border rounded p-2"
              min="1"
            />
            <button
              onClick={handleAwardXP}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Award XP
            </button>
          </div>
          <p className="mt-2 text-sm">{xpStatus}</p>
        </div>
      )}



      {/* Delete Account */}
      <div className="mt-12 max-w-[600px] border-t pt-6">
        <h4 className="text-lg font-semibold mb-2">Delete Account</h4>
        <p className="text-sm text-gray-700 mb-4">
          This will permanently delete your account and all associated data.
        </p>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Delete My Account
        </button>
        <p className="mt-2 text-sm text-red-600">{deleteStatus}</p>
      </div>

      {/* Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg z-10">
            <h4 className="text-lg font-semibold mb-4">
              Confirm Account Deletion
            </h4>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to permanently delete your account? This
              action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 text-white rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 !bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}