import { useState } from 'react'
import { HamburgerButton } from '../components/hamburgerbutton'
import { SideMenu } from '../components/sidemenu'

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="side-menu">
      <HamburgerButton onClick={() => setMenuOpen(!menuOpen)} />
      <SideMenu isOpen={menuOpen} />
      {/* Main landing content */}
    </div>
  )
}
