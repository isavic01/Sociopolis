import { useEffect, useState } from "react";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../../services/firebaseConfig";

type User = {
  id: string;
  displayName: string;
  xp: number;
};

export const LeaderboardPanel = () => {
  const [topUsers, setTopUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const leaderboardDoc = await getDoc(doc(db, "leaderboard", "top10"));
      const topUserIds: string[] = leaderboardDoc.exists()
        ? leaderboardDoc.data().topUserIds ?? []
        : [];

      const userPromises = topUserIds.map(async (userId) => {
        const userDoc = await getDoc(doc(db, "users", userId));
        const data = userDoc.exists()
          ? (userDoc.data() as Omit<User, "id">)
          : { displayName: "Unknown", xp: 0 };
        return {
          id: userId,
          displayName: data.displayName ?? "Anonymous",
          xp: data.xp ?? 0,
        };
      });

      const users = await Promise.all(userPromises);
      setTopUsers(users);
      setLoading(false);
    };

    fetchLeaderboard();
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
          if (index === 0) trophySrc = "/src/assets/svg/trophy-gold.svg";
          if (index === 1) trophySrc = "/src/assets/svg/trophy-silver.svg";
          if (index === 2) trophySrc = "/src/assets/svg/trophy-bronze.svg";

          return (
            <li
              key={user.id}
              className="flex items-center justify-between bg-white rounded-lg shadow p-2"
            >
              <div className="flex items-center gap-3">
                {trophySrc ? (
                  <img
                    src={trophySrc}
                    alt="Trophy"
                    className="w-6 h-6 shrink-0"
                  />
                ) : (
                  <span className="w-6 text-center p">{index + 1}</span>
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