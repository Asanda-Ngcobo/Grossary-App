// app/terms/page.tsx
import React from 'react';

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto pt-[25%] lg:pt-[10%] p-6 text-gray-900">
      <h1 className="text-3xl font-bold mb-4">Grossary Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-8">Effective Date: 05 July 2025</p>

      <section className="space-y-6">
        <p>
          Welcome to <strong>Grossary</strong> (“we,” “us,” “our”), a web application that helps users manage grocery lists, track spending, and simplify shopping.
        </p>

        <p>
          By accessing or using Grossary (the “Service”), you agree to be bound by these Terms of Service (“Terms”).
           If you do not agree to these Terms, please do not use the Service.
        </p>

        <h2 className="text-xl font-semibold mt-8">1. Eligibility</h2>
        <p>You must be at least 16 years old to use Grossary. By using the Service,
             you represent and warrant that you meet this requirement.</p>

        <h2 className="text-xl font-semibold mt-8">2. Account Registration</h2>
        <p>To use certain features of Grossary, you may need to create an account. You agree to:</p>
            <ul className=''>
                <li>Provide accurate and complete information.</li>
                <li>Keep your login credentials secure.</li>
                <li>Notify us immediately of any unauthorized access to your account.</li>
            </ul>
<p>We reserve the right to suspend or terminate accounts that violate these Terms.</p>

        <h2 className="text-xl font-semibold mt-8">3. Use of the Service</h2>
        <p>Grossary provides tools for:</p>
        <ul>
            <li>Creating and managing grocery lists.</li>
            <li>Tracking spending and budgeting.</li>
            <li>Viewing estimated totals and price comparisons (if available in your region).</li>
            <li>Saving list history for future use.

</li>
        </ul>
        <p>You agree to use Grossary only for lawful purposes and in accordance with these Terms.</p>

        <h2 className="text-xl font-semibold mt-8">4. Privacy</h2>
            <p>We respect your privacy. By using Grossary, you also agree to our <a href="/privacy-policy" className="text-blue-600 underline">Privacy Policy</a>, 
                which describes how we collect, use, and protect your data.</p>

        <h2 className="text-xl 
        font-semibold mt-8">5. User Content</h2>
        <p>You are responsible for any content you submit, such as grocery items or notes. By submitting content, you grant us a non-exclusive, 
            royalty-free license to use that content solely for the purpose of operating the Service.</p>

  <h2 className="text-xl font-semibold mt-8">6.Prohibited Activities</h2>
        <p>You agree not to:</p>
        <ul>
            <li>Use the Service for any illegal or unauthorized purpose.</li>
            <li>Attempt to gain unauthorized access to our systems.</li>
            <li>Disrupt or interfere with the Service’s operation.</li>
            <li>Use automated scripts to access or interact with Grossary.

</li>
        </ul>

     <h2 className="text-xl font-semibold mt-8">7.Intellectual Property</h2>
        <p>All content, trademarks, logos, and software used in Grossary are the property of Grossary or its licensors. 
            You may not copy, modify, distribute, or use any part of Grossary without our written permission.</p>
     
      <h2 className="text-xl font-semibold mt-8">8.Termination</h2>
        <p>We may suspend or terminate your access to the Service
             at any time without notice if you violate these Terms or for any other reason at our discretion.</p>

             
      <h2 className="text-xl font-semibold mt-8">9. Disclaimers</h2>
        <p>The Service is provided “as is” and “as available.” We do not guarantee:.</p>

  <ul>
            <li>That the Service will always be secure or error-free.</li>
            <li>That price comparisons or totals will be fully accurate.</li>
    
        </ul>

        <p>You use the Service at your own risk.</p>

      <h2 className="text-xl font-semibold mt-8">10. Limitation of Liability</h2>
        <p>To the maximum extent permitted by law, Grossary and its team will not be liable for any indirect, 
            incidental, or consequential damages arising out of your use of the Service.</p>

        <h2 className="text-xl font-semibold mt-8">11. Changes to the Terms</h2>
        <p>We may update these Terms from time to time. If we make material changes, we will notify you. 
            Continued use of the Service after changes means you accept the new Terms.</p>

               <h2 className="text-xl font-semibold mt-8">12. Governing Law</h2>
        <p>These Terms are governed by the laws of the Republic of South Africa. Any disputes shall be resolved in the courts of South Africa.</p>

        {/* <h2 className="text-xl font-semibold mt-8">Contact Us</h2>
        <p>Email: <a href="mailto:support@grossary.app" className="text-blue-600 underline">support@grossary.app</a></p> */}
      </section>
    </main>
  );
}
