import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="container py-16 max-w-3xl">
        <Badge>Legal</Badge>
        <h1 className="text-4xl font-bold mt-4">Terms of Service</h1>
        <p className="text-white/60 mt-6">
          Last updated: {new Date().toLocaleDateString('uk-UA')}
        </p>

        <div className="space-y-6 mt-8 text-white/80">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By using KOSTEX, you agree to these Terms of Service. If you do not agree, please
              do not use our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. Services</h2>
            <p>
              KOSTEX provides digital product development services. All prices shown are
              estimates and may be adjusted after project review.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. Orders and Payment</h2>
            <p>
              When you place an order, you agree to provide accurate information. Final price
              and timeline will be confirmed by KOSTEX before development begins.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Intellectual Property</h2>
            <p>
              All custom work created for you becomes your property upon full payment.
              KOSTEX retains the right to display non-confidential work in the portfolio.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">5. Limitation of Liability</h2>
            <p>
              KOSTEX is not liable for any indirect damages arising from the use of our
              services. Our total liability is limited to the amount paid for the project.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}