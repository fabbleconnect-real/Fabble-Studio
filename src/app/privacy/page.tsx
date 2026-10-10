import type { Metadata } from "next";
import { LegalPage } from "@/components/site/LegalPage";
import { emailHref, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Fabble Studio",
  description: "How Fabble Studio collects, uses and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="October 10, 2026">
      <p>
        Fabble Studio offers web design, backend development and video editing
        services. This Privacy Policy explains what personal information we collect when you visit our website, contact us or use our
        services, how we use it, and the choices you have.
      </p>
      <p>By using our website or services, you agree to the practices described here.</p>

      <h2>1. Information We Collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li>Name, email address, phone number and company name when you fill in a contact form, request a quote or email us.</li>
        <li>Project details, briefs, files, footage, images, logos and other materials you share so we can deliver our services.</li>
        <li>
          Billing details needed to issue invoices and receive payments. Payments are handled by third-party payment providers; we do
          not store full card or bank details.
        </li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li>
          Device and browser type, IP address, pages visited, time spent and referring website, collected through cookies and analytics
          tools.
        </li>
      </ul>
      <h3>Information from social media</h3>
      <ul>
        <li>
          If you message us on Instagram (
          <a href={site.instagram.href} target="_blank" rel="noopener noreferrer">
            @{site.instagram.handle}
          </a>
          ) or other platforms, we receive the details you choose to share with us.
        </li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To respond to enquiries and provide quotes.</li>
        <li>To deliver, manage and improve our web design, backend and video editing services.</li>
        <li>To send invoices, project updates and support messages.</li>
        <li>To understand how visitors use our website and improve it.</li>
        <li>To send occasional updates about our work, only where you have agreed, with an option to unsubscribe at any time.</li>
        <li>To comply with legal obligations and protect against fraud or misuse.</li>
      </ul>

      <h2>3. Client Content and Confidentiality</h2>
      <p>
        Files, footage, source code and business information you share with us remain yours. We use them only to complete your project
        and do not share them with anyone except trusted tools or collaborators needed to deliver the work, who are expected to keep them
        confidential. We may show completed work in our portfolio only with your permission.
      </p>

      <h2>4. Cookies and Analytics</h2>
      <p>
        We use cookies and similar technologies to keep the website working and to understand traffic. You can disable cookies in your
        browser settings, though some features may not work properly.
      </p>

      <h2>5. Sharing of Information</h2>
      <p>We do not sell your personal information. We may share it with:</p>
      <ul>
        <li>Service providers such as hosting, analytics, email, cloud storage and payment providers, who process it on our behalf.</li>
        <li>Freelancers or collaborators working on your project under confidentiality.</li>
        <li>Authorities, where required by law.</li>
      </ul>

      <h2>6. Data Storage and Security</h2>
      <p>
        We use reasonable technical and organisational measures to protect your information. No method of transmission or storage is
        completely secure, so we cannot guarantee absolute security. Your information may be stored on servers located outside India,
        handled by our service providers.
      </p>

      <h2>7. Data Retention</h2>
      <p>
        We keep personal information only as long as needed for the purposes above, including meeting legal, accounting and tax
        requirements. After that, we delete or anonymise it.
      </p>

      <h2>8. Your Rights</h2>
      <p>Subject to applicable law, including India&rsquo;s Digital Personal Data Protection Act, 2023, you may:</p>
      <ul>
        <li>Ask for access to the personal data we hold about you.</li>
        <li>Ask us to correct or update it.</li>
        <li>Ask us to delete it.</li>
        <li>Withdraw consent for marketing communications at any time.</li>
      </ul>
      <p>To exercise these rights, contact us using the details below.</p>

      <h2>9. Third-Party Links</h2>
      <p>
        Our website may link to other sites, such as social media platforms. We are not responsible for their privacy practices and
        encourage you to read their policies.
      </p>

      <h2>10. Contact Us</h2>
      <p>For any questions about this policy or your personal data, reach us at:</p>
      <ul>
        <li>
          Email:{" "}
          <a href={emailHref} target="_blank" rel="noopener noreferrer">
            {site.email}
          </a>
        </li>
        <li>
          Phone: <a href={`tel:${site.phones[0].tel}`}>{site.phones[0].display}</a>
        </li>
      </ul>

      <h2>11. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo; date above shows the latest version.
        Continued use of our website after changes means you accept the updated policy.
      </p>
    </LegalPage>
  );
}
