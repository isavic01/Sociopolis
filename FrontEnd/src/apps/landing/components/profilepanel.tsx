import { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { signOut } from "firebase/auth"
import { auth } from "../../services/firebaseConfig"
import { db } from "../../services/firebaseConfig"
import { useAuthContext } from "../../auth/components/authProvider"

type UserProfile = {
  id: string
  displayName: string
  xp: number
  avatarUrl?: string
  currentLesson?: string
  streaks?: number
}

const handleSignOut = async () => {
  try {
    await signOut(auth)
    // Optionally redirect or show a message
    console.log("User signed out")
  } catch (error) {
    console.error("Error signing out:", error)
  }
}


export const ProfilePanel = () => {
  const { user, loading: authLoading } = useAuthContext()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      const ref = doc(db, "users", user.uid)
      const snapshot = await getDoc(ref)

      if (snapshot.exists()) {
        const data = snapshot.data() as Omit<UserProfile, "id">
        setProfile({
          id: snapshot.id,
          displayName: data.displayName ?? "Anonymous",
          xp: data.xp ?? 0,
          avatarUrl: data.avatarUrl,
          currentLesson: data.currentLesson ?? "Intro to Sociology",
          streaks: data.streaks ?? 0,
        })
      }

      setLoading(false)
    }

    if (!authLoading) {
      fetchProfile()
    }
  }, [user, authLoading])

  if (authLoading || loading) {
    return <p className="p-4 text-center text-gray-600">Loading profile…</p>
  }

  if (!profile) {
    return <p className="p-4 text-center text-gray-600">No profile found</p>
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <h3 className="text-2xl font-bold mb-2">profile</h3>
      <p className="text-sm text-gray-700 mb-6">
        See your progress and badges
      </p>

      {/* Avatar + username */}
      <div className="flex flex-row items-start p-6">
        <div className="relative">
          <img
            src={profile.avatarUrl || "/src/assets/soci.png"}
            alt="Profile avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
        <div className="flex-col !items-end">
          <h4 className="p-4 !text-base text-[#FFFFFF]">@{profile.displayName}</h4>
          <span className="p-4 !text-base text-[#FFFFFF]">{profile.xp} XP</span>
        </div>
      </div>

      {/* Current lesson */}
      <div className="rounded-lg p-2">
        <h5 className="!text-lg mb-2 text-[#FFFFFF]">Current Lesson</h5>
        <p className="!text-sm text-[#FFFFFF]">{profile.currentLesson}</p>
      </div>

      {/* Streaks */}
      <div className="p-2 mb-6">
        <h5 className="font-semibold mb-2">Streaks</h5>
        <div className="h-[25vh] bg-white rounded-lg flex items-center justify-center">
          {/*{profile.streaks > 0
            ? `${profile.streaks} day streak 🔥`
            : "No streak yet"}*/}
        </div>
      </div>

      {/* Sign out */}
      <button
        onClick={handleSignOut}
        className="w-full bg-red-500 text-white py-2 font-semibold rounded-lg hover:bg-red-600 transition"
      >
        SIGN OUT
      </button>
    </div>
  )
}