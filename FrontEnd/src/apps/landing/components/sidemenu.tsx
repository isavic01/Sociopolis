import { useState } from "react"
import { MenuItem } from "./menuitem"
import { ProfilePanel } from "./profilepanel"
import SettingsPanel from "./settingspanel"
import { LeaderboardPanel } from "./leaderboardpanel"

export const SideMenu = ({ isOpen }: { isOpen: boolean }) => {
  const [activePanel, setActivePanel] = useState<string | null>(null)

  const togglePanel = (panel: string) => {
    setActivePanel(prev => (prev === panel ? null : panel))
  }

  return (
    <div
      className={`fixed top-[5vh] left-0 h-[95vh] flex z-40 transition-all duration-300
        ${isOpen ? "w-screen md:w-[60vw]" : "w-0 invisible pointer-events-none"}`}
    >
      {/* Menu column */}
      <div
        className={`flex flex-col items-stretch pt-4 bg-[#C1D6EB] transition-opacity duration-300
          ${isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}
          w-[4vw] md:w-[24vw]`}
      >
        <MenuItem
          label="Profile"
          iconSrc="/src/assets/svg/profile.svg"
          onClick={() => togglePanel("profile")}
        />
        <MenuItem
          label="Settings"
          iconSrc="/src/assets/svg/gear.svg"
          onClick={() => togglePanel("settings")}
        />
        <MenuItem
          label="Leaderboard"
          iconSrc="/src/assets/svg/trophy.svg"
          onClick={() => togglePanel("leaderboard")}
        />
      </div>

      {/* Panel column */}
      {isOpen && activePanel && (
        <div className="flex-1 bg-[#92B6DB] p-4 overflow-y-auto transition-transform duration-300">
          {activePanel === "profile" && <ProfilePanel />}
          {activePanel === "settings" && <SettingsPanel />}
          {activePanel === "leaderboard" && <LeaderboardPanel />}
        </div>
      )}
    </div>
  )
}