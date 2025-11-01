import { useState } from 'react'
import { HamburgerButton } from '../components/hamburgerbutton'
import { SideMenu } from '../components/sidemenu'
import { Background } from '../components/background';
import { useAuthContext } from "../../auth/components/authProvider"
// import { REGIONS } from './RegionDefs';
// import { useEffect } from 'react';
// import { useProgressStore } from '@/features/progress/progressStore'; /Users/isabelhernandez/Desktop/sociopolis/FrontEnd/src/features/progress/progressStore.ts
// import { Hotspot } from './Hotspot';


export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, loading } = useAuthContext()
  //temp place for the reports
  const [reportText, setReportText] = useState("");
  const [status, setStatus] = useState("");
  return (
<div className="relative min-h-screen">
  <Background/>
  <SideMenu isOpen={menuOpen} />
  <HamburgerButton onClick={() => setMenuOpen(!menuOpen)} />

  {/* Main landing content */}

</div>
  )}
