import { Globe, Mail  } from "@deemlol/next-icons";
import Link from "next/link";

export const metadata = {
  title: "Cancellation & Refund Policy | Grossary",
  description:
    "Learn how Grossary+ cancellations, free trials, subscription payments and refunds work.",
};

export default function CancellationPolicyPage() {
  return (
    <main className="min-h-screen bg-[#F8FAF9] ">
      {/* Header */}
      <section className="border-b border-gray-200 bg-white  pt-20">
        <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-[#0B2E1E] hover:text-[#1EC677]"
          >
            <span aria-hidden="true">←</span>
            Back to Grossary
          </Link>

          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-[#1EC677]/10 px-3 py-1 text-sm font-semibold text-[#0B2E1E]">
              grossary <span className="text-[#1EC677]">plus</span>
            </span>

            <h1 className="mt-5 text-4xl font-bold tracking-tight text-[#0B2E1E] sm:text-5xl">
              Cancellation & Refund Policy
            </h1>

            <p className="mt-4 text-base leading-7 text-gray-600">
              This policy explains how cancellations, subscription payments,
              free trials and refunds work for   grossary<span className="text-[#1EC677]">plus</span>.
            </p>

            <p className="mt-4 text-sm text-gray-500">
              Last updated: 24 September 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm sm:p-10">
          <PolicySection number="1" title="Grossary+ Subscription">
            <p>
            grossary<span className="text-[#1EC677]">plus</span> is currently offered at{" "}
              <strong className="text-gray-900">R39 per month</strong>.
            </p>

            <p>
              New eligible subscribers receive a{" "}
              <strong className="text-gray-900">7-day free trial</strong>{" "}
              before their first monthly subscription payment is charged.
            </p>

            <p>
              Unless you cancel your subscription before the end of your free
              trial or before your next billing date, your grossary<span className="text-[#1EC677]">plus</span>{' '}
              subscription will automatically renew at the applicable monthly
              subscription price.
            </p>

            <p>
              We will clearly display the applicable subscription price before
              you subscribe.
            </p>
          </PolicySection>

          <PolicySection number="2" title="R1 Card Verification">
            <p>
              When you start your grossary<span className="text-[#1EC677]">plus</span> free trial, a{" "}
              <strong className="text-gray-900">
                R1 verification transaction
              </strong>{" "}
              may be processed through our payment provider, Paystack.
            </p>

            <p>
              This transaction is used to verify your payment method and enable
              future subscription payments.
            </p>

            <p>
              The R1 verification amount is{" "}
              <strong className="text-gray-900">
                not the grossary<span className="text-[#1EC677]">plus</span> subscription fee
              </strong>{" "}
              and is intended to be refunded after successful verification.
              Depending on your bank or card provider, it may take some time
              for the refund to appear in your account.
            </p>
          </PolicySection>

          <PolicySection number="3" title="Cancelling During Your Free Trial">
            <p>
              You may cancel grossary<span className="text-[#1EC677]">plus</span> at any time during your 7-day free
              trial.
            </p>

            <p>If you cancel before the trial ends:</p>

            <ul className="list-disc space-y-2 pl-6">
              <li>
                You will not be charged the R39 monthly subscription fee.
              </li>
              <li>Your subscription will not automatically renew.</li>
              <li>
                You may continue using grossary<span className="text-[#1EC677]">plus</span> until the end of your
                free-trial period.
              </li>
            </ul>

            <p>
              After the trial expires, your grossary<span className="text-[#1EC677]">plus</span> access will end unless
              you have an active paid subscription.
            </p>
          </PolicySection>

          <PolicySection number="4" title="Cancelling a Paid Subscription">
            <p>You may cancel your grossary<span className="text-[#1EC677]">plus</span> subscription at any time.</p>

            <p>
              Cancelling prevents your subscription from renewing for another
              billing period.
            </p>

            <p>
              If you cancel after paying for a monthly billing period, you may
              continue using grossary<span className="text-[#1EC677]">plus</span> until the end of that billing period.
              Your access will then end and you will not be charged for another
              month.
            </p>

            <ExampleBox>
              If your subscription renews on 1 October and you cancel on 15
              October, you may continue using grossary<span className="text-[#1EC677]">plus</span> until the end of the
              paid subscription period. You will not be charged for the
              following monthly renewal.
            </ExampleBox>
          </PolicySection>

          <PolicySection number="5" title="How to Cancel">
            <p>
              You can cancel your subscription from your Grossary account by
              navigating to account,  manage plus membership settings and selecting{" "}
              <strong className="text-gray-900">Cancel Grossary+</strong>.
            </p>

            <p>
              Follow the cancellation instructions displayed on the screen.
            </p>

            <p>
              Once successfully cancelled, your account will indicate that
              your subscription will not renew.
            </p>

            <p>
              If you experience difficulty cancelling your subscription,
              please contact us using the support details provided on the
              Grossary website.
            </p>
          </PolicySection>

          <PolicySection number="6" title="Refunds">
            <p>
              Cancelling a grossary<span className="text-[#1EC677]">plus</span> subscription does not automatically result
              in a refund for a subscription period that has already been paid
              for and made available to you.
            </p>

            <p>
              However, if you believe you were charged incorrectly, charged
              after properly cancelling your subscription, charged more than
              once for the same subscription period, or experienced another
              billing error, please contact us so that we can investigate the
              transaction.
            </p>

            <p>
              Where a refund is required by applicable South African law, we
              will process the refund accordingly.
            </p>

            <p>
              Approved refunds will be returned through the applicable payment
              method or payment provider. The time taken for funds to appear in
              your account may depend on your bank, card issuer, or payment
              provider.
            </p>
          </PolicySection>

          <PolicySection number="7" title="Failed Subscription Payments">
            <p>
              If we are unable to process your subscription payment, your
              grossary<span className="text-[#1EC677]">plus</span> subscription may be marked as past due.
            </p>

            <p>
              We may provide a limited grace period to allow the payment issue
              to be resolved. If payment is not successfully completed, access
              to grossary<span className="text-[#1EC677]">plus</span> may be suspended or terminated.
            </p>

            <p>
              You will not receive another free trial simply because a previous
              subscription expired, was cancelled, or experienced a failed
              payment.
            </p>
          </PolicySection>

          <PolicySection number="8" title="Changes to Subscription Pricing">
            <p>
              grossary<span className="text-[#1EC677]">.</span> may change the price of grossary<span className="text-[#1EC677]">plus</span> in the future.
            </p>

            <p>
              Where a price change affects an existing recurring subscription,
              we will provide appropriate notice before the new price applies,
              where required.
            </p>

            <p>
              Cancelling your subscription before the applicable new price
              takes effect will prevent subsequent renewals under the new
              price.
            </p>
          </PolicySection>

          <PolicySection number="9" title="Changes to This Policy">
            <p>
              We may update this Cancellation & Refund Policy from time to
              time, including when we change grossary<span className="text-[#1EC677]">plus</span>, our payment processes,
              or applicable legal requirements.
            </p>

            <p>
              The latest version will be published on Grossary with the date on
              which it was last updated.
            </p>
          </PolicySection>

          <PolicySection number="10" title="Contact Us" last>
            <p>
              If you have questions about a cancellation, payment, refund, or
              grossary<span className="text-[#1EC677]">plus</span> subscription, please contact us.
            </p>

            <div className="mt-5 rounded-2xl bg-[#F3F7F5] p-5">
               grossary<span className="text-[#1EC677]">.</span>

             

              <p className="text-sm text-gray-600">South Africa</p>

              <div className="mt-4 flex flex-col gap-2">
                  <a
                  href="mailto:support@grossary.shop"
                  className="w-fit flex gap-2 font-medium text-[#0B2E1E] underline decoration-[#1EC677] decoration-2 underline-offset-4"
                >
                  <span>WhatsApp:</span>+27 72 124 7120
                </a>
              

                {/* Replace this with your preferred support email */}
                <a
                  href="mailto:support@grossary.shop"
                  className="w-fit flex gap-2 font-medium text-[#0B2E1E] underline decoration-[#1EC677] decoration-2 underline-offset-4"
                >
                  <span>Email:</span>support@grossary.shop
                </a>
              </div>
            </div>
          </PolicySection>
        </div>

        {/* Footer navigation */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-gray-500">
          <Link
            href="/"
            className="transition hover:text-[#0B2E1E]"
          >
            Home
          </Link>

          <Link
            href="/company/terms"
            className="transition hover:text-[#0B2E1E]"
          >
            Terms & Conditions
          </Link>

          <Link
            href="/company/privacy-policy"
            className="transition hover:text-[#0B2E1E]"
          >
            Privacy Policy
          </Link>

            <Link
            href="/company/contactus"
            className="transition hover:text-[#0B2E1E]"
          >
            Help Info
          </Link>
        </div>
      </section>
    </main>
  );
}


/* ========================================
   POLICY SECTION
======================================== */

function PolicySection({
  number,
  title,
  children,
  last = false,
}) {
  return (
    <section
      className={
        last
          ? ""
          : "mb-10 border-b border-gray-100 pb-10"
      }
    >
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#1EC677]/10 text-sm font-bold text-[#0B2E1E]">
          {number}
        </span>

        <h2 className="pt-0.5 text-xl font-bold text-[#0B2E1E] sm:text-2xl">
          {title}
        </h2>
      </div>

      <div className="space-y-4 leading-7 text-gray-600">
        {children}
      </div>
    </section>
  );
}


/* ========================================
   EXAMPLE BOX
======================================== */

function ExampleBox({ children }) {
  return (
    <div className="rounded-2xl border border-[#1EC677]/20 bg-[#1EC677]/5 p-5">
      <p className="mb-1 text-sm font-bold text-[#0B2E1E]">
        Example
      </p>

      <p className="text-sm leading-6 text-gray-600">
        {children}
      </p>
    </div>
  );
}