import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Badge from '@/components/ui/Badge';

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="container py-16 max-w-3xl">
        <Badge>Legal</Badge>
        <h1 className="text-4xl font-bold mt-4">Privacy Policy</h1>
        <p className="text-white/60 mt-6">
          Last updated: {new Date().toLocaleDateString('uk-UA')}
        </p>

        <div className="space-y-6 mt-8 text-white/80">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>
              When you register on KOSTEX, we collect your name, email address, and information
              you provide when creating orders or sending messages.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">2. How We Use Your Information</h2>
            <p>
              We use your information to provide our services, process your orders, communicate
              with you, and improve our platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">3. Data Storage</h2>
            <p>
              Your data is stored securely using Firebase services (Google Cloud). We do not
              sell or share your personal data with third parties.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">4. Your Rights</h2>
            <p>
              You can access, update, or delete your account information at any time from your
              account settings. To request complete data deletion, contact us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-3">5. Contact</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us through the
              contact page.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}