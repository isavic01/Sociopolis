import { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  doc,
  getDoc,
  query,
  where,
  getDocs
} from "firebase/firestore";
import { deleteUser } from "firebase/auth";
import { db, auth } from "../../services/firebaseConfig";
import { awardXP } from "../../services/xpService";


type TargetUser = {
  uid: string;
  email?: string;
  displayName?: string;
  [key: string]: any; // optional: allows extra fields like XP, admin, etc.
};


export default function SettingsPanel() {
  const [reportText, setReportText] = useState("");
  const [status, setStatus] = useState("");
  const [deleteStatus, setDeleteStatus] = useState("");
  const [deletionTarget, setDeletionTarget] = useState<"self" | "admin" | null>(null);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [xpAmount, setXpAmount] = useState("");
  const [xpStatus, setXpStatus] = useState("");
  const [searchUser, setSearchUser] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [targetUser, setTargetUser] = useState<TargetUser | null>(null);
  const [adminToggleStatus, setAdminToggleStatus] = useState("");
  const [showAdminConfirmModal, setShowAdminConfirmModal] = useState(false);
  const [pendingAdminValue, setPendingAdminValue] = useState<boolean | null>(null);

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

  async function handleSearchUser() {
    setSearchStatus("Searching...");
    setTargetUser(null);

    try {
      // If input looks like an email, query by email
      if (searchUser.includes("@")) {
        const q = query(collection(db, "users"), where("email", "==", searchUser));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnap = querySnapshot.docs[0];
          setTargetUser({ uid: docSnap.id, ...docSnap.data() });
          setSearchStatus("User found by email.");
        } else {
          setSearchStatus("No user found with that email.");
        }
      } else {
        // Otherwise treat it as UID
        const docRef = doc(db, "users", searchUser);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTargetUser({ uid: docSnap.id, ...docSnap.data() });
          setSearchStatus("User found by UID.");
        } else {
          setSearchStatus("No user found with that UID.");
        }
      }
    } catch (err) {
      console.error("Error searching user:", err);
      setSearchStatus("Search failed.");
    }
  }

  async function handleAwardXPToUser() {
    const amount = parseInt(xpAmount);
    if (!targetUser || isNaN(amount)) {
      setXpStatus("Invalid target or amount.");
      return;
    }

    try {
      const newXP = await awardXP(targetUser.uid, amount);
      setXpAmount("");
      setXpStatus(`XP updated. New XP: ${newXP}`);
    } catch (err) {
      console.error("Error updating XP:", err);
      setXpStatus("Failed to update XP.");
    }
  }

  async function handleDeleteUserAccount() {
  if (!targetUser) {
    setDeleteStatus("No target user.");
    return;
  }

  try {
    // Delete from users collection
    await deleteDoc(doc(db, "users", targetUser.uid));

    // Delete from leaderboard collection
    await deleteDoc(doc(db, "leaderboard", targetUser.uid));

    setDeleteStatus("User account and leaderboard entry deleted.");
    setTargetUser(null);
  } catch (err) {
    console.error("Error deleting user:", err);
    setDeleteStatus("Failed to delete user.");
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
    await deleteDoc(doc(db, "leaderboard", user.uid));
    await deleteUser(user);
    setDeleteStatus("Your account and leaderboard entry have been deleted.");
    setDeletionTarget(null);
  } catch (err: any) {
    console.error("Error deleting account:", err);
    if (err.code === "auth/requires-recent-login") {
      setDeleteStatus("Please reauthenticate to delete your account.");
    } else {
      setDeleteStatus("Failed to delete account.");
    }
  }
}
async function handleToggleAdmin(newValue: boolean | null) {
  if (!targetUser || newValue === null) return;

  try {
    await updateDoc(doc(db, "users", targetUser.uid), {
      admin: newValue,
    });
    setTargetUser({ ...targetUser, admin: newValue });
    setAdminToggleStatus(`Admin status updated to: ${newValue ? "Admin" : "Not Admin"}`);
  } catch (err) {
    console.error("Error updating admin status:", err);
    setAdminToggleStatus("Failed to update admin status.");
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




      {isAdmin && (
        <div className="mt-8 max-w-[600px] border-t pt-6">
          <h4 className="text-lg font-semibold mb-2">Admin Controls</h4>


          <div className="mb-4">
            <input
              type="text"
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
              placeholder="Enter user email or UID"
              className="w-full border rounded p-2"
            />
            <button
              onClick={handleSearchUser}
              className="mt-2 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Search User
            </button>
            <p className="text-sm mt-2">{searchStatus}</p>
          </div>


          {targetUser && (
            <div className="mb-4">
              <p className="text-sm text-gray-700 mb-2">
                Target: {targetUser.displayName || targetUser.email || targetUser.uid} Current XP: {targetUser.xp}
              </p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={xpAmount}
                  onChange={(e) => setXpAmount(e.target.value)}
                  placeholder="XP amount (+/-)"
                  className="flex-1 border rounded p-2"
                />
                <button
                  onClick={handleAwardXPToUser}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Update XP
                </button>
              </div>
              <p className="mt-2 text-sm">{xpStatus}</p>
            </div>
          )}


          {targetUser && (
            <div className="mt-4">
              <button
                onClick={() => setDeletionTarget("admin")}
                className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
              >
                Delete This User
              </button>
              <p className="mt-2 text-sm text-red-600">{deleteStatus}</p>
              <div className="mt-6">
                <p className="text-sm text-gray-700 mb-2">
                  Admin Status: {targetUser.admin ? "✅ Admin" : "❌ Not Admin"}
                </p>
                <button
                  onClick={() => {
                    setPendingAdminValue(!targetUser.admin);
                    setShowAdminConfirmModal(true);
                  }}
                  className={`w-full py-2 rounded text-white ${
                    targetUser.admin ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-500 hover:bg-blue-600"
                  }`}
                >
                  {targetUser.admin ? "Revoke Admin" : "Make Admin"}
                </button>
                <p className="mt-2 text-sm">{adminToggleStatus}</p>
              </div>
            </div>

          )}
        </div>

      )}




      <div className="mt-12 max-w-[600px] border-t pt-6">
        <h4 className="text-lg font-semibold mb-2">Delete Account</h4>
        <p className="text-sm text-gray-700 mb-4">
          This will permanently delete your account and all associated data.
        </p>
        <button
          onClick={() => setDeletionTarget("self")}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
        >
          Delete My Account
        </button>
        <p className="mt-2 text-sm text-red-600">{deleteStatus}</p>
      </div>

      {showAdminConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg z-10">
            <h4 className="text-lg font-semibold mb-4">Confirm Admin Change</h4>
            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to {pendingAdminValue ? "grant" : "revoke"} admin privileges for this user?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowAdminConfirmModal(false)}
                className="px-4 py-2 bg-gray-300 text-white rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await handleToggleAdmin(pendingAdminValue);
                  setShowAdminConfirmModal(false);
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {deletionTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="relative bg-white rounded-lg p-6 w-[90%] max-w-md shadow-lg z-10">
            <h4 className="text-lg font-semibold mb-4">
              {deletionTarget === "self"
                ? "Confirm Account Deletion"
                : "Confirm User Deletion"}
            </h4>
            <p className="text-sm text-gray-700 mb-6">
              {deletionTarget === "self"
                ? "Are you sure you want to permanently delete your account? This action cannot be undone."
                : "Are you sure you want to permanently delete this user's account? This action cannot be undone."}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setDeletionTarget(null)}
                className="px-4 py-2 bg-gray-300 text-white rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (deletionTarget === "self") {
                    await handleDeleteAccount();
                  } else {
                    await handleDeleteUserAccount();
                  }
                  setDeletionTarget(null);
                }}
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