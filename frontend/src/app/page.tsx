import Link from 'next/link'
import Header from '@/components/layout/Header'

export default function Home() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Invest in Real Estate
              <br />
              <span className="text-gray-600">Starting at $1,000</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Fractional ownership of premium properties. Build wealth through real estate without the traditional barriers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/register"
                className="bg-gray-900 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Get Started
              </Link>
              <Link
                href="/properties"
                className="text-gray-900 px-8 py-3.5 rounded-lg font-medium border border-gray-300 hover:border-gray-400 transition-colors"
              >
                Browse Properties
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-gray-200">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">$50M+</div>
                <div className="text-sm text-gray-600">Property Value</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">8.5%</div>
                <div className="text-sm text-gray-600">Avg. Return</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">$1K</div>
                <div className="text-sm text-gray-600">Min. Investment</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">500+</div>
                <div className="text-sm text-gray-600">Investors</div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div>
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Low Minimum</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Start with $1,000. No large capital required.
                </p>
              </div>
              <div>
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Diversified</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Spread risk across multiple properties and markets.
                </p>
              </div>
              <div>
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Passive Income</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Earn returns from rentals and appreciation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Properties Preview */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Featured Properties</h2>
              <p className="text-gray-600">Curated investment opportunities</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <Link
                  key={i}
                  href="/properties"
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-40 bg-gray-200"></div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-2">Premium Property {i}</h3>
                    <p className="text-sm text-gray-500 mb-3">New York, NY</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">From</span>
                      <span className="font-semibold text-gray-900">$2,000</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center">
              <Link
                href="/properties"
                className="text-gray-900 font-medium hover:text-gray-700 transition-colors text-sm"
              >
                View All Properties →
              </Link>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Investing?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join investors building wealth through real estate
            </p>
            <Link
              href="/register"
              className="inline-block bg-gray-900 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">R</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">RealEstate</span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm">Platform</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/properties" className="hover:text-gray-900 transition-colors">Properties</Link></li>
                  <li><Link href="/investments" className="hover:text-gray-900 transition-colors">Investments</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm">Legal</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/terms" className="hover:text-gray-900 transition-colors">Terms</Link></li>
                  <li><Link href="/privacy" className="hover:text-gray-900 transition-colors">Privacy</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 text-sm">Support</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/contact" className="hover:text-gray-900 transition-colors">Contact</Link></li>
                  <li><Link href="/faq" className="hover:text-gray-900 transition-colors">FAQ</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
              <p>&copy; {new Date().getFullYear()} RealEstate. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
