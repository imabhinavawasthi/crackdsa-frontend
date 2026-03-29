import React from "react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | CrackDSA",
  description: "Read the Privacy Policy for using the CrackDSA platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <Link href="/" className="inline-block mb-6">
            <span className="text-2xl font-bold text-brand-500">CrackDSA</span>
          </Link>
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Last updated: March 29, 2026
          </p>
        </div>

        <div className="prose prose-blue dark:prose-invert max-w-none space-y-8 text-gray-600 dark:text-gray-300">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
            <p>
              When you use CrackDSA, we collect certain information to provide and improve our services:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2 font-medium text-gray-800 dark:text-gray-200">
              <li>Account Details: Name, email address, and profile picture provided through auth providers.</li>
              <li>Usage Data: Information on how you interact with the platform, such as problem attempts and progress trackers.</li>
              <li>Device Information: IP address, browser type, and operating system.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2>
            <p>
              We use the collected data for various purposes:
            </p>
            <ul className="list-disc pl-6 mt-2 space-y-2">
              <li>To provide and maintain the Platform;</li>
              <li>To personalize your learning experience;</li>
              <li>To notify you about changes to our Platform or services;</li>
              <li>To allow you to participate in interactive features of our Platform;</li>
              <li>To provide customer support;</li>
              <li>To gather analysis or valuable information so that we can improve the Platform;</li>
              <li>To monitor the usage of the Platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">3. Data Security</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">4. Third-Party Services</h2>
            <p>
              We may employ third-party companies and individuals to facilitate our Platform ("Service Providers"), to provide the Platform on our behalf, or to assist us in analyzing how our Platform is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">5. Cookies</h2>
            <p>
              Cookies are files with small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device's hard drive. We use cookies to collect information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">6. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>
          </section>
        </div>

        <div className="mt-20 pt-10 border-t border-gray-100 dark:border-gray-800 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Questions about your privacy? <Link href="mailto:privacy@crackdsa.com" className="text-brand-500 hover:underline">Contact our Privacy Team</Link>
          </p>
          <Link href="/" className="mt-6 inline-block text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
