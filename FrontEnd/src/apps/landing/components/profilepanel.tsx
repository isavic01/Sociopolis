import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth } from "../../services/firebaseConfig";
import { db } from "../../services/firebaseConfig";
import { useAuthContext } from "../../auth/components/authProvider";

type UserProfile = {
  id: string;
  displayName: string;
  xp: number;
  avatarUrl?: string;
  currentLesson?: string;
  streaks?: number;
};

export const ProfilePanel = () => {
  const { user, loading: authLoading } = useAuthContext();
  const [profile, setProfile] = useState<UserProfile | null>(null);
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
    const fetchProfile = async () => {
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        const data = snapshot.data() as Omit<UserProfile, "id">;
        setProfile({
          id: snapshot.id,
          displayName: data.displayName ?? "Anonymous",
          xp: data.xp ?? 0,
          avatarUrl: data.avatarUrl,
          currentLesson: data.currentLesson ?? "Intro to Sociology",
          streaks: data.streaks ?? 0,
        });
      }

      setLoading(false);
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [user, authLoading]);

  if (authLoading || loading) {
    return <p className="p-4 text-center text-gray-600">Loading profile…</p>;
  }

  if (!profile) {
    return <p className="p-4 text-center text-gray-600">No profile found</p>;
  }

  return (
    <div className="p-4 h-full overflow-y-auto relative">
      <h3 className="text-2xl font-bold mb-2">profile</h3>
      <p className="text-sm text-gray-700 mb-6">See your progress and badges</p>

      <div className="flex flex-row items-start p-6">
        <div className="relative">
          <img
            src={profile.avatarUrl || "/src/assets/soci.png"}
            alt="Profile avatar"
            className="w-28 h-28"
          />
        </div>
        <div className="flex-col !items-end">
          <h4 className="p-4 !text-base">{profile.displayName}</h4>
          <span className="p-4 !text-base text-gray-700">{profile.xp} XP</span>
        </div>
      </div>

      {/* Current lesson */}
      <div className="rounded-lg p-2">
        <h5 className="!text-lg font-bold mb-2">Current Lesson</h5>
        <p className="!text-sm text-gray-700">{profile.currentLesson}</p>
      </div>

      {/* Streaks */}
      <div className="p-2 mb-6">
        <h5 className="font-semibold mb-2">Streaks</h5>
        <div className="h-[25vh] bg-white rounded-lg flex items-center justify-center">
          {/*{profile.streaks > 0 ? `${profile.streaks} day streak 🔥` : "No streak yet"}*/}
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={confirmSignOut}
        className="w-full bg-red-500 text-white py-2 font-semibold rounded-lg hover:bg-red-600 transition"
      >
        SIGN OUT
      </button>

      {/* Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-100/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
            <h4 className="h4">Confirm Sign Out</h4>
            <p className="">Are you sure you want to sign out?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-white bg-gray-300 rounded "
              >
                CANCEL
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 !bg-red-500 text-white rounded"
              >
                SIGN OUT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};