import { useState } from 'react'
import { MenuItem } from './menuitem'
import { ProfilePanel } from './profilepanel'
import { SettingsPanel } from './settingspanel'
import { LeaderboardPanel } from './leaderboardpanel'


export const SideMenu = ({ isOpen }: { isOpen: boolean }) => {
  const [activePanel, setActivePanel] = useState<string | null>(null)

  return (
    <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <MenuItem label="Profile" onClick={() => setActivePanel('profile')} />
      <MenuItem label="Settings" onClick={() => setActivePanel('settings')} />
      <MenuItem label="Leaderboard" onClick={() => setActivePanel('leaderboard')} />

      <div className="mt-4 p-4 border-t">
        {activePanel === 'profile' && <ProfilePanel />}
        {activePanel === 'settings' && <SettingsPanel />}
        {activePanel === 'leaderboard' && <LeaderboardPanel />}
      </div>
    </div>
  )
}
