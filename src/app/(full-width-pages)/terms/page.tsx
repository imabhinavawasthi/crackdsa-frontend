import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | CrackDSA",
  description: "Read the Terms and Conditions for using the CrackDSA platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block mb-6">
            <span className="text-2xl font-bold text-brand-500">CrackDSA</span>
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Terms and Conditions
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Last updated: March 29, 2026
          </p>
        </div>

        <div className="prose prose-blue dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using CrackDSA ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. Use of License</h2>
            <p>
              Permission is granted to temporarily access the materials on CrackDSA for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license, you may not:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>Modify or copy the materials;</li>
              <li>Use the materials for any commercial purpose, or for any public display;</li>
              <li>Attempt to decompile or reverse engineer any software contained on the Platform;</li>
              <li>Remove any copyright or other proprietary notations from the materials; or</li>
              <li>Transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. User Conduct</h2>
            <p>
              You agree to use CrackDSA only for lawful purposes. You are prohibited from posting or transmitting any material that is defamatory, offensive, or otherwise violates the rights of others.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Intellectual Property</h2>
            <p>
              All content on CrackDSA, including text, graphics, logos, and code, is the property of CrackDSA and is protected by intellectual property laws. Your use of the Platform does not grant you ownership of any content you access.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Disclaimer</h2>
            <p>
              The materials on CrackDSA are provided on an 'as is' basis. CrackDSA makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Limitation of Liability</h2>
            <p>
              In no event shall CrackDSA or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on CrackDSA.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">7. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of India and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.
            </p>
          </section>
        </div>

        <div className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Questions about our Terms? <Link href="mailto:support@crackdsa.com" className="text-brand-500 hover:underline">Contact Support</Link>
          </p>
          <Link href="/" className="mt-6 inline-block text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
