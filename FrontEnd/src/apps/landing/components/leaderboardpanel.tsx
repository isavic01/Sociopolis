import { useEffect, useState } from 'react'
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore'
import { db } from '../../services/firebaseConfig'

type User = {
  id: string
  displayName: string
  xp: number
}

export const LeaderboardPanel = () => {
  const [topUsers, setTopUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const q = query(collection(db, 'leaderboard'), orderBy('xp', 'desc'), limit(10))
      const snapshot = await getDocs(q)
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as User[]
      setTopUsers(users)
    }

    fetchLeaderboard()
  }, [])

  return (
    <div className="panel-content">
      <h3 className="subheading">Leaderboard</h3>
      <img className="trophy" src="/src/assets/trophy.png" alt="Trophy" />
      <ul className="leaderboard-list">
        {topUsers.map((user, index) => (
          <li key={user.id} className="text">
            <span className="position">{index + 1}</span>
            <span className="name">{user.displayName}</span>
            <span className="xp">{user.xp} XP</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
