import { useEffect, useState } from "react";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";

type User = {
  id: string;
  displayName: string;
  xp: number;
  avatarUrl?: string | null;
};

export const LeaderboardPanel = () => {
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`🏆 Setting up leaderboard listener`);
    
    // Listen to leaderboard updates
    const leaderboardRef = doc(db, "leaderboard", "top10");
    
    const unsubscribe = onSnapshot(leaderboardRef, async (snapshot) => {
      console.log(`📡 Leaderboard snapshot received`);
      
      try {
        if (!snapshot.exists()) {
          console.log(`❌ No leaderboard document found`);
          setTopUsers([]);
          setLoading(false);
          return;
        }

        const data = snapshot.data();
        console.log(`📊 Leaderboard document data:`, data);
        
        const topUserIds: string[] = data.topUserIds ?? [];
        
        if (topUserIds.length === 0) {
          console.log(`⚠️ No users in leaderboard`);
          setTopUsers([]);
          setLoading(false);
          return;
        }

        console.log(`👥 Fetching data for ${topUserIds.length} users:`, topUserIds);

        // Fetch fresh user data for each user in the leaderboard
        const userPromises = topUserIds.map(async (userId) => {
          const userDoc = await getDoc(doc(db, "users", userId));
          const data = userDoc.exists()
            ? userDoc.data()
            : { displayName: "Unknown", xp: 0, avatarUrl: null };

          console.log(`👤 User ${userId} data:`, { xp: data.xp, displayName: data.displayName });

          return {
            id: userId,
            displayName: data.displayName ?? "Anonymous",
            xp: data.xp ?? 0,
            avatarUrl: data.avatarUrl ?? null,
          };
        });

        const users = await Promise.all(userPromises);
        // Sort by XP in descending order to ensure proper ranking
        const sortedUsers = users.sort((a, b) => b.xp - a.xp);
        
        console.log(`🎯 Final sorted leaderboard:`, sortedUsers.map(u => ({ name: u.displayName, xp: u.xp })));
        
        setTopUsers(sortedUsers);
        setLoading(false);
        console.log("🏆 Leaderboard updated with latest XP data");
        
      } catch (error) {
        console.error("❌ Error fetching leaderboard:", error);
        setLoading(false);
      }
    });

    return () => {
      console.log(`🧹 Cleaning up leaderboard listener`);
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <p className="p-2 text-center">Loading leaderboard…</p>;
  }

  return (
    <div className="p-2 h-full overflow-y-auto">
      <h3 className="!text-2xl h3 text-center mb-2">Leaderboard</h3>
      <p className="text-center text-sm mb-2">
        Gain XP and become a top player
      </p>

      <ul className="space-y-3">
  {topUsers.map((user, index) => {
    let trophySrc = "";
    if (index === 0) trophySrc = "/src/assets/svg/gold_trophy.svg";
    if (index === 1) trophySrc = "/src/assets/svg/silver_trophy.svg";
    if (index === 2) trophySrc = "/src/assets/svg/bronze_trophy.svg";

    return (
      <li
        key={user.id}
        className="flex items-center justify-between bg-white rounded-lg shadow p-2"
      >
        <div className="flex items-center gap-3">
          {trophySrc ? (
            <img src={trophySrc} alt="Trophy" className="w-6 h-6 shrink-0" />
          ) : (
            <span className="w-6 text-center">{index + 1}</span>
          )}
          {user.avatarUrl && (
            <img
              src={user.avatarUrl || "/src/assets/svg/avatars/soci_lightblue.svg" }
              alt={`${user.displayName}'s Avatar`}
              className="w-8 h-8 rounded-full"
            />
          )}
          <span>{user.displayName}</span>
        </div>
        <span className="text-sm">{user.xp} XP</span>
      </li>
    );
  })}
</ul>
    </div>
  );
};