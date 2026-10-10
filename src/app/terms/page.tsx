import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/site/LegalPage";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms and Conditions | Fabble Studio",
  description: "The terms that govern use of the Fabble Studio website and our web design, backend development and video editing services.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms and Conditions" updated="October 10, 2026">
      <p>
        These Terms and Conditions govern your use of the Fabble Studio website and the services we provide, including web design, backend
        development and video editing. By accessing our website or hiring us, you agree to these Terms. If you do not agree, please do not
        use our website or services.
      </p>

      <h2>1. Services</h2>
      <p>
        We provide web design, backend development, video editing and related creative and technical services. The exact scope,
        deliverables, timeline and price for each project are set out in a written quote, proposal or agreement confirmed by both parties,
        including by email or message. In these Terms, this is called the Project Agreement.
      </p>

      <h2>2. Getting Started and Client Responsibilities</h2>
      <ul>
        <li>Work begins once the Project Agreement is accepted and any agreed advance payment is received.</li>
        <li>
          You agree to provide accurate briefs, content, footage, logos, credentials and feedback on time. Delays on your side may extend
          the delivery timeline.
        </li>
        <li>
          You confirm that you own, or have permission to use, all materials you give us, and that they do not infringe anyone&rsquo;s
          rights.
        </li>
      </ul>

      <h2>3. Payments</h2>
      <ul>
        <li>
          Prices and payment schedules are stated in the Project Agreement. Unless agreed otherwise, an advance payment is required before
          work starts, with the balance due on or before final delivery.
        </li>
        <li>Invoices must be paid by the due date. We may pause work or withhold final files until payment is received.</li>
        <li>Advance payments are non-refundable once work has begun, unless otherwise agreed in writing.</li>
        <li>
          Taxes, third-party fees (such as domains, hosting, stock media, plugins, fonts or licences) are the client&rsquo;s responsibility
          unless included in the quote.
        </li>
      </ul>

      <h2>4. Revisions</h2>
      <p>
        Each project includes the number of revision rounds stated in the Project Agreement. Additional revisions, or changes beyond the
        original scope, may be charged separately. Requests that significantly change the scope will be quoted before work continues.
      </p>

      <h2>5. Timelines</h2>
      <p>
        We aim to deliver within the agreed timeline. Dates are estimates and depend on timely feedback, content and payments from you. We
        are not liable for delays caused by factors outside our reasonable control.
      </p>

      <h2>6. Intellectual Property</h2>
      <ul>
        <li>
          Upon full payment, ownership of the final deliverables created specifically for you transfers to you, excluding third-party
          materials, open-source components, stock assets and our pre-existing tools, templates and code, which remain under their own
          licences or ours.
        </li>
        <li>You keep ownership of all materials you provide.</li>
        <li>Until full payment is received, we retain ownership of all work produced.</li>
        <li>
          Unless you ask us not to in writing, we may display completed work in our portfolio, website and social media (including{" "}
          <a href={site.instagram.href} target="_blank" rel="noopener noreferrer">
            @{site.instagram.handle}
          </a>
          ) to showcase our services.
        </li>
      </ul>

      <h2>7. Confidentiality</h2>
      <p>
        We treat non-public information you share with us as confidential and use it only to deliver your project. This does not apply to
        information that is public, already known to us, or that we are legally required to disclose.
      </p>

      <h2>8. Third-Party Tools and Services</h2>
      <p>
        Our work may rely on third-party software, hosting, plugins, music, stock footage and other services. These are governed by their
        own terms, and we are not responsible for their availability, changes or failures.
      </p>

      <h2>9. Hosting, Maintenance and Support</h2>
      <p>
        Unless stated in the Project Agreement, ongoing hosting, maintenance, updates, backups and support are not included after
        delivery. A limited period for fixing bugs in delivered work may be offered, as stated in the Project Agreement. You are
        responsible for keeping backups of your own content.
      </p>

      <h2>10. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, Fabble Studio is not liable for indirect, incidental or consequential losses, including
        lost profits, data or business opportunities. Our total liability for any claim relating to a project will not exceed the amount
        you paid us for that project.
      </p>

      <h2>11. Cancellation and Termination</h2>
      <p>
        Either party may end a project by written notice. If you cancel, you remain responsible for payment for work completed up to the
        cancellation date, and any advance paid is not refundable. We may suspend or terminate services if you breach these Terms, fail to
        pay or provide materials that are unlawful or infringing.
      </p>

      <h2>12. Acceptable Use of the Website</h2>
      <p>
        You agree not to misuse our website, including attempting unauthorised access, introducing harmful code, scraping content without
        permission or using it for unlawful purposes. All website content, design and branding belong to Fabble Studio and may not be
        copied or reused without permission.
      </p>

      <h2>13. Privacy</h2>
      <p>
        Your use of our website and services is also governed by our <Link href="/privacy">Privacy Policy</Link>, which explains how we
        handle personal information.
      </p>

      <h2>14. Governing Law and Disputes</h2>
      <p>
        These Terms are governed by the laws of India. We encourage resolving any dispute through good-faith discussion first. If it cannot
        be resolved, it will be subject to the exclusive jurisdiction of the courts located in [your city], India.
      </p>

      <h2>15. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. The &ldquo;Last updated&rdquo; date shows the latest version. Continued use of our
        website or services after changes means you accept them. Changes do not affect Project Agreements already accepted, unless both
        parties agree.
      </p>
    </LegalPage>
  );
}
