import { useState } from 'react'
import { MenuItem } from './menuitem'
import { ProfilePanel } from './profilepanel'
import { SettingsPanel } from './settingspanel'
import { LeaderboardPanel } from './leaderboardpanel'
import '../layout/sidemenu.css'

export const SideMenu = ({ isOpen }: { isOpen: boolean }) => {
  const [activePanel, setActivePanel] = useState<string | null>(null)

  const togglePanel = (panel: string) => {
    setActivePanel(prev => (prev === panel ? null : panel))
  }

  return (
    <div className={`side-menu-wrapper ${isOpen ? 'open' : 'closed'}`}>
      <div className="menu-column">
        <MenuItem label="Profile" onClick={() => togglePanel('profile')} />
        <MenuItem label="Settings" onClick={() => togglePanel('settings')} />
        <MenuItem label="Leaderboard" onClick={() => togglePanel('leaderboard')} />
      </div>

      {/* Only show panel if menu is open */}
      {isOpen && activePanel && (
        <div className="panel-column">
          {activePanel === 'profile' && <ProfilePanel />}
          {activePanel === 'settings' && <SettingsPanel />}
          {activePanel === 'leaderboard' && <LeaderboardPanel />}
        </div>
      )}
    </div>
  )
}