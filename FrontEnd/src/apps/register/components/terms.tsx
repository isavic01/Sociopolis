import React from 'react'

type Props = {
  isOpen: boolean
  onClose: () => void
}

export const TermsModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null

  return (
    <div className="terms-overlay">
      <div className="terms-box">
        <h1 className="h1">Terms & Conditions</h1>
        <ol className = "h2 p-2">
            <li>
                <h2 className="h2"> Eligibility </h2>
                <ul className= "unordered-list">
                    <li className = "text">    You must provide accurate, current, and complete information when registering. </li>
                    <li className = "text">    If you are under 13, you may only use the site with the consent and supervision of a parent or legal guardian. </li>
                    <li className = "text">    By using the service, you represent that you have the legal capacity to enter into these Terms. </li>
                </ul>
            </li>
            <li>
                <h2 className="h2"> Accounts </h2>
                <ul className= "unordered-list">
                    <li className = "text">    You are responsible for maintaining the confidentiality of your login credentials. </li>
                    <li className = "text">    You are responsible for all activity that occurs under your account. </li>
                    <li className = "text">    If you suspect unauthorized use of your account, you must notify us immediately. </li>
                    <li className = "text">    We reserve the right to refuse registration, suspend, or terminate accounts at our discretion. </li>
                </ul>
            </li>
            <li>
                <h2 className="h2"> Use of the Service </h2>
                <ul className= "unordered-list">
                    <li className = "text">    Sociopolis is provided for educational purposes only. </li>
                    <li className = "text">    You agree not to misuse the service, including but not limited to: hacking, spamming, reverse engineering, or interfering with others’ use. </li>
                    <li className = "text">    Social features are limited to a global leaderboard. By participating, your chosen display name may appear publicly. </li>
                    <li className = "text">    You may not use the service for unlawful, commercial, or exploitative purposes. </li>
                </ul>
            </li>
            <li>
                <h2 className="h2"> Advertisements </h2>
                <ul className= "unordered-list">
                    <li className = "text">    The free version of the service may include third-party advertisements. </li>
                    <li className = "text">    We are not responsible for the content of third-party ads or any products/services offered through them. </li>
                    <li className = "text">    If you are under 13, only non-personalized ads will be displayed. </li>
                </ul>
            </li>
            <li>
                <h2 className="h2"> Purchases (Ad-Free Tier) </h2>
                <ul className= "unordered-list">
                    <li className = "text">    We may offer an optional paid subscription that removes ads. </li>
                    <li className = "text">    Payments are processed securely by a trusted third-party provider. We do not store full payment card details. </li>
                    <li className = "text">    All purchases are final unless otherwise required by applicable law. Refund requests will be reviewed on a case-by-case basis. </li>
                    <li className = "text">    We reserve the right to change subscription prices or features. Changes will not affect an already purchased active subscription. </li>
                </ul>
            </li>
            <li>
                <h2 className="h2"> Privacy </h2>
                <ul className= "unordered-list">
                    <li className = "text">    We collect and use personal information as described in our Privacy Policy. </li>
                    <li className = "text">    By using the service, you consent to our collection, use, and disclosure of information in accordance with that policy. </li>
                </ul>
            </li>
            <li>
                <h2 className="h2"> Content & Accuracy </h2>
                <ul className= "unordered-list">
                    <li className = "text">    Educational materials and resources are provided “as is” and “as available.” </li>
                    <li className = "text">    We make no warranties regarding accuracy, completeness, reliability, or suitability for exams, work, or professional use. </li>
                    <li className = "text">    You acknowledge that use of the content is at your own risk. </li>
                </ul>
            </li>
            <li>
                <h2 className="h2"> Termination </h2>
                <ul className= "unordered-list">
                    <li className = "text">    We may suspend, restrict, or delete accounts that violate these Terms or applicable laws. </li>
                    <li className = "text">    You may terminate your account at any time by contacting us. </li>
                    <li className = "text">    Upon termination, your right to access the service will immediately cease. </li>
                </ul>
            </li>
            <li>
                <h2 className="h2"> Limitation of Liability </h2>
                <ul className= "unordered-list">
                    <li className = "text">    Sociopolis is provided free of charge (with optional paid features). </li>
                    <li className = "text">    To the maximum extent permitted by law, we are not liable for any indirect, incidental, consequential, or punitive damages arising from your use of the service. </li>
                    <li className = "text">    Our total liability for any claim shall not exceed the amount you paid (if any) for the service in the 12 months preceding the claim. </li>
                </ul>
            </li>
            <li>
                <h2 className="h2">  Indemnification </h2>
                <ul className= "unordered-list">
                    <li className = "text">    You agree to indemnify and hold harmless Sociopolis, its affiliates, employees, and partners from any claims, damages, or expenses arising from your use of the service or violation of these Terms. </li>
                </ul>
            </li>
            <li>
                <h2 className="h2"> Changes </h2>
                <ul className= "unordered-list">
                    <li className = "text">   We may update these Terms from time to time. Updates will be posted with a new “Last Updated” date. </li>
                    <li className = "text">   If changes are material, we will provide reasonable notice (such as by email or in-app notification). </li>
                    <li className = "text">   Continued use of the service after changes take effect constitutes acceptance of the updated Terms. </li>
                </ul>
            </li>
            <li>
                <h2 className="h2"> Governing Law & Dispute Resolution </h2>
                <ul className= "unordered-list">
                    <li className = "text">   These Terms are governed by the laws of Florida. </li>
                    <li className = "text">   Any disputes will be resolved exclusively in the courts of Florida, unless otherwise required by applicable law. </li>
                    <li className = "text">   You agree to first attempt to resolve disputes informally by contacting us before pursuing legal action. </li>
                </ul>
            </li>
            <li>
                <h2 className="h2"> Contact Us </h2>
                <p className = "text">   If you have questions about these Terms, please contact us at: <br></br>
                Sociopolis
                Email: <a href="mailto:privacy@sociopolis.com" className="text-blue-600 underline">privacy@sociopolis.com</a>
                </p>
            </li>

        </ol>
        <button onClick={onClose} className="shadow-sm !bg-[#F7F7F7] !text-[#838080] !border p !border-[#D9D9D9] !px-4 !py-2 !mx-2 !rounded-lg focus:outline-none">
          Close
        </button>
      </div>
    </div>
  )
}

export const PrivacyModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null

  return (
    <div className="terms-overlay ">
      <div className="terms-box">
        <h1 className="h1">Privacy Policy</h1>
        <p className="text">Last Updated: September 25, 2025</p>
        <p className="text">
          Sociopolis (“we,” “our,” or “us”) values your privacy. This Privacy Policy explains what information we collect, how we use it, and the choices you have regarding your personal data. By using our services, you agree to the practices described below.
        </p>

        <ol className="h2 p-2">
          <li>
            <h2 className="h2">Information We Collect</h2>
            <ul className="text">
              <li className="text">Name (to display on the leaderboard)</li>
              <li className="text">Age (to comply with age-related laws and restrictions)</li>
              <li className="text">Email address (for login, account recovery, and communication)</li>
              <li className="text">Password (stored securely in encrypted form)</li>
              <li className="text">Payment details (processed securely by our payment provider; we do not store full card numbers)</li>
              <li className="text">Technical info like IP address, browser type, and usage data</li>
            </ul>
          </li>

          <li>
            <h2 className="h2">How We Use Your Information</h2>
            <ul className="text">
              <li className="text">Provide account access and core site functionality</li>
              <li className="text">Display your chosen name on the global leaderboard</li>
              <li className="text">Send service-related updates and support messages</li>
              <li className="text">Display or remove ads based on your subscription tier</li>
              <li className="text">Process payments and maintain transaction records</li>
              <li className="text">Improve performance and prevent fraud or abuse</li>
            </ul>
          </li>

          <li>
            <h2 className="h2">Advertising</h2>
            <ul className="unordered-list">
              <li className="text">Free version displays third-party ads</li>
              <li className="text">Advertisers may use cookies or similar technologies</li>
              <li className="text">Under 13: only non-personalized ads</li>
              <li className="text">13 or older: ads may be personalized based on limited data</li>
            </ul>
          </li>

          <li>
            <h2 className="h2">Purchases & Payments</h2>
            <ul className="unordered-list">
              <li className="text">Payments processed securely by third-party provider</li>
              <li className="text">We do not store full card details</li>
              <li className="text">We may store transaction records for account management</li>
            </ul>
          </li>

          <li>
            <h2 className="h2">Children’s Privacy</h2>
            <ul className="unordered-list">
              <li className="text">Under 13 requires verified parental consent</li>
              <li className="text">We comply with COPPA</li>
              <li className="text">Children under 13 see only non-personalized ads</li>
            </ul>
          </li>

          <li>
            <h2 className="h2">Data Storage & Security</h2>
            <ul className="unordered-list">
              <li className="text">Passwords encrypted, never stored in plain text</li>
              <li className="text">We use reasonable safeguards to protect your data</li>
              <li className="text">No method is 100% secure; use at your own risk</li>
              <li className="text">We retain data only as long as necessary</li>
            </ul>
          </li>

          <li>
            <h2 className="h2">Your Rights</h2>
            <ul className="unordered-list">
              <li className="text">Access, correct, or delete your data</li>
              <li className="text">Opt out of personalized ads or analytics</li>
              <li className="text">Request a copy of your data in portable format</li>
              <li className="text">Contact privacy@sociopolis.com to exercise rights</li>
            </ul>
          </li>

          <li>
            <h2 className="h2">Changes to This Policy</h2>
            <ul className="unordered-list">
              <li className="text">We may update this policy periodically</li>
              <li className="text">Material changes will be announced via email or site notice</li>
              <li className="text">“Last Updated” date reflects the current version</li>
            </ul>
          </li>

          <li>
            <h2 className="h2">Contact Us</h2>
            <p className="text">
              If you have questions or concerns about this Privacy Policy, please contact us at:<br />
              Sociopolis<br />
              Email: <a href="mailto:privacy@sociopolis.com" className="text-blue-600 underline">privacy@sociopolis.com</a>
            </p>
          </li>
        </ol>

        <button onClick={onClose} className="shadow-sm !bg-[#F7F7F7] !text-[#838080] !border p !border-[#D9D9D9] !px-4 !py-2 !mx-2 !rounded-lg focus:outline-none">
          Close
        </button>
      </div>
    </div>
  )
}