import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
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
    if (!user || authLoading) return;

    console.log(`👤 Setting up profile listener for user: ${user.uid}`);

    // Set up real-time listener for user profile updates
    const userRef = doc(db, "users", user.uid);
    
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      console.log(`📡 Profile snapshot received for user ${user.uid}`);
      
      if (snapshot.exists()) {
        const data = snapshot.data() as Omit<UserProfile, "id">;
        const newProfile = {
          id: snapshot.id,
          displayName: data.displayName ?? "Anonymous",
          xp: data.xp ?? 0,
          avatarUrl: data.avatarUrl,
          currentLesson: data.currentLesson ?? "Intro to Sociology",
          streaks: data.streaks ?? 0,
        };
        
        setProfile(newProfile);
        console.log("🔄 Profile XP updated to:", data.xp ?? 0);
        console.log("📊 Full profile data:", newProfile);
      } else {
        console.log("❌ No profile document found for user:", user.uid);
        setProfile(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("❌ Error listening to profile updates:", error);
      setLoading(false);
    });

    // Cleanup listener on component unmount
    return () => {
      console.log(`🧹 Cleaning up profile listener for user: ${user.uid}`);
      unsubscribe();
    };
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

      <div className="rounded-lg p-2">
        <h5 className="!text-lg font-bold mb-2">Current Lesson</h5>
        <p className="!text-sm text-gray-700">{profile.currentLesson}</p>
      </div>

      <div className="p-2 mb-6">
        <h5 className="font-semibold mb-2">Streaks</h5>
        <div className="h-[25vh] bg-white rounded-lg flex items-center justify-center">
          {/*{profile.streaks > 0 ? `${profile.streaks} day streak ` : "No streak yet"}*/} // Placeholder for streaks visualization
        </div>
      </div>


      <button
        onClick={confirmSignOut}
        className="w-full bg-red-500 text-white py-2 font-semibold rounded-lg hover:bg-red-600 transition"
      >
        SIGN OUT
      </button>

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