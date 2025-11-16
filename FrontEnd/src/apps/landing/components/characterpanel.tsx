import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db } from "../../services/firebaseConfig";
import { useAuthContext } from "../../auth/components/authProvider";

export const CharacterPanel = () => {
  const { user, loading: authLoading } = useAuthContext();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const confirmSignOut = () => setShowConfirmModal(true);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out");
      setShowConfirmModal(false);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    const fetchAvatar = async () => {
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        const data = snapshot.data();
        setAvatarUrl(data.avatarUrl ?? null);
      }

      setLoading(false);
    };

    if (!authLoading) {
      fetchAvatar();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <p className="p-4 text-center text-gray-600">Loading avatar…</p>;
  }

  if (!avatarUrl) {
    return <p className="p-4 text-center text-gray-600">No avatar found</p>;
  }

  return (
    <div className="p-4 h-full overflow-y-auto relative">
      <img src={avatarUrl} alt="User Avatar" className="w-24 h-24 rounded-full mx-auto" />
    </div>
  );
};