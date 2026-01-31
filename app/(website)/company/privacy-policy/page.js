// app/terms/page.tsx
import React from 'react';

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto pt-[25%] lg:pt-[10%] p-6 text-gray-900">
      <h1 className="text-3xl font-bold mb-4">Grossary Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Effective Date: 05 July 2025</p>

      <section className="space-y-6">
        <p>
         Grossary (“we,” “our,” or “us”) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services (the “Service”).

By using Grossary, you agree to the terms of this Privacy Policy.
        </p>

        <h2 className="text-xl font-semibold mt-8">1. Information We Collect</h2>
        <h3>a. Information You Provide to Us</h3>
        <ul>
            <li>Account information: name, email address, and password.</li>
            <li>Grocery list data: items, budgets, and prices you input.</li>
            <li>Feedback or support messages.</li>
        </ul>

         <h3>b. Automatically Collected Information</h3>
        <ul>
            <li>Device and browser information..</li>
            <li>IP address and approximate location.</li>
            <li>Usage activity (e.g., which features you use).</li>
        </ul>
        

        <h2 className="text-xl font-semibold mt-8">2. How We Use Your Information</h2>
        <p>We use your data to:</p>
            <ul className=''>
                <li>Provide and improve the Service.</li>
                <li>Personalize your user experience.</li>
                <li>Communicate with you about updates, new features, or support.</li>
                <li>Analyze user behavior to improve performance.</li>
                <li>Enforce our Terms of Service.</li>
            </ul>
<p>We do not sell or rent your personal information to third parties.

</p>

        <h2 className="text-xl font-semibold mt-8">3. Legal Basis for Processing</h2>
        <p>If you are located in South Africa, we process your information in accordance with the POPIA. We only collect and use your information::</p>
        <ul>
            <li>With your consent.</li>
            <li>To fulfill a contract with you.</li>
            <li>To comply with legal obligations.</li>
            <li>When we have a legitimate interest that is not overridden by your rights.
</li>
        </ul>


        <h2 className="text-xl font-semibold mt-8"> 4. Sharing of Information</h2>
            <p>We may share your information with:</p>
     <ul>
            <li><b>Service providers</b> (e.g., hosting, analytics, or email services) who are bound by confidentiality agreements.</li>
            <li><b>Authorities</b> if required by law or to protect our rights.</li>
           
            <li><b>Affiliates or partners</b> only if necessary for the Service, and only with your consent.
</li>
        </ul>

        <h2 className="text-xl 
        font-semibold mt-8">5. Data Storage and Security</h2>
        <p>We use secure hosting and encryption technologies to protect your information. However, no method of transmission or storage is 100% secure.
             We encourage you to use strong passwords and log out after using shared devices.</p>

  <h2 className="text-xl font-semibold mt-8">6. Data Retention</h2>
        <p>We retain your personal data only as long as necessary:</p>
        <ul>
            <li>To provide the Service.</li>
            <li>To comply with legal obligations.</li>
            <li>Until you delete your account.</li>
  
        </ul>
        <p>If you delete your account, we will remove or anonymize your data within 30 days unless legally required to keep it.</p>

     <h2 className="text-xl font-semibold mt-8">7. Your Rights</h2>
          <p>Under POPIA, you have the right to:</p>
        <ul>
            <li>Access your personal data.</li>
            <li>Request correction or deletion.</li>
            <li>Object to processing or withdraw consent.</li>
            <li>Lodge a complaint with the Information Regulator.</li>
  
        </ul>
        {/* <p>To exercise these rights, contact us at support@grossary.app.</p> */}

     
      <h2 className="text-xl font-semibold mt-8">8. Children’s Privacy</h2>
        <p>Grossary is not intended for children under 16. We do not knowingly collect data from minors.
            
             If we learn that we have, we will delete it immediately.</p>

             
      <h2 className="text-xl font-semibold mt-8">9. International Data Transfers</h2>
        <p>If Grossary processes data outside South Africa, we ensure appropriate safeguards are in place to protect your personal information.</p>


      <h2 className="text-xl font-semibold mt-8">10. Changes to This Policy</h2>
        <p>We may update this Privacy Policy. When we do, we’ll revise the “Effective Date” above and notify users where appropriate.</p>

        {/* <h2 className="text-xl font-semibold mt-8">11. Contact Us</h2>
        <p>If you have any questions or concerns about this Privacy Policy, contact us at:</p>
        <ul>
            <li>📧 support@grossary.app</li>
            <li>📍 Durban, South Africa</li>
        </ul> */}

      </section>
    </main>
  );
}
