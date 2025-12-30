'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { InvestmentWithProperty, InvestmentStatus, PropertyType, PropertyStatus } from '@/types/domains'

const mockInvestments: InvestmentWithProperty[] = [
  {
    id: 'inv-1',
    userId: 'user-1',
    propertyId: '1',
    shares: 5,
    amountInvested: 10000,
    sharePrice: 2000,
    status: InvestmentStatus.ACTIVE,
    purchaseDate: '2024-01-15T10:00:00Z',
    expectedReturn: 850,
    actualReturn: undefined,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    property: {
      id: '1',
      title: 'Luxury Downtown Apartment Complex',
      description: 'Premium residential complex in the heart of downtown.',
      address: {
        street: '123 Main Street',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
      },
      propertyType: PropertyType.RESIDENTIAL,
      totalValue: 5000000,
      availableShares: 2500,
      sharePrice: 2000,
      minInvestment: 2000,
      expectedAnnualReturn: 8.5,
      investmentTerm: 60,
      status: PropertyStatus.LISTED,
      images: ['/property1.jpg'],
      documents: [],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
  },
  {
    id: 'inv-2',
    userId: 'user-1',
    propertyId: '2',
    shares: 3,
    amountInvested: 12000,
    sharePrice: 4000,
    status: InvestmentStatus.ACTIVE,
    purchaseDate: '2024-01-10T10:00:00Z',
    expectedReturn: 864,
    actualReturn: undefined,
    createdAt: '2024-01-10T10:00:00Z',
    updatedAt: '2024-01-10T10:00:00Z',
    property: {
      id: '2',
      title: 'Commercial Office Building',
      description: 'Prime commercial real estate in business district.',
      address: {
        street: '456 Business Ave',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        country: 'USA',
      },
      propertyType: PropertyType.COMMERCIAL,
      totalValue: 12000000,
      availableShares: 3000,
      sharePrice: 4000,
      minInvestment: 4000,
      expectedAnnualReturn: 7.2,
      investmentTerm: 72,
      status: PropertyStatus.FUNDING,
      images: ['/property2.jpg'],
      documents: [],
      createdAt: '2024-01-10T10:00:00Z',
      updatedAt: '2024-01-10T10:00:00Z',
    },
  },
  {
    id: 'inv-3',
    userId: 'user-1',
    propertyId: '5',
    shares: 2,
    amountInvested: 4000,
    sharePrice: 2000,
    status: InvestmentStatus.ACTIVE,
    purchaseDate: '2024-01-25T10:00:00Z',
    expectedReturn: 408,
    actualReturn: undefined,
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z',
    property: {
      id: '5',
      title: 'Beachfront Condominium',
      description: 'Exclusive beachfront property with luxury amenities.',
      address: {
        street: '555 Ocean Drive',
        city: 'Miami',
        state: 'FL',
        zipCode: '33139',
        country: 'USA',
      },
      propertyType: PropertyType.RESIDENTIAL,
      totalValue: 3200000,
      availableShares: 1600,
      sharePrice: 2000,
      minInvestment: 2000,
      expectedAnnualReturn: 10.2,
      investmentTerm: 36,
      status: PropertyStatus.FUNDING,
      images: ['/property5.jpg'],
      documents: [],
      createdAt: '2024-01-25T10:00:00Z',
      updatedAt: '2024-01-25T10:00:00Z',
    },
  },
  {
    id: 'inv-4',
    userId: 'user-1',
    propertyId: '6',
    shares: 1,
    amountInvested: 5000,
    sharePrice: 5000,
    status: InvestmentStatus.CONFIRMED,
    purchaseDate: '2024-02-01T10:00:00Z',
    expectedReturn: 440,
    actualReturn: undefined,
    createdAt: '2024-02-01T10:00:00Z',
    updatedAt: '2024-02-01T10:00:00Z',
    property: {
      id: '6',
      title: 'Tech Campus Office Space',
      description: 'Modern office building in tech corridor.',
      address: {
        street: '888 Innovation Park',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'USA',
      },
      propertyType: PropertyType.COMMERCIAL,
      totalValue: 9500000,
      availableShares: 1900,
      sharePrice: 5000,
      minInvestment: 5000,
      expectedAnnualReturn: 8.8,
      investmentTerm: 60,
      status: PropertyStatus.LISTED,
      images: ['/property6.jpg'],
      documents: [],
      createdAt: '2024-01-18T10:00:00Z',
      updatedAt: '2024-01-18T10:00:00Z',
    },
  },
]

const portfolioSummary = {
  totalInvested: 31000,
  totalExpectedReturns: 2562,
  activeInvestments: 3,
  completedInvestments: 0,
  averageReturn: 8.3,
}

export default function InvestmentsPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadgeColor = (status: InvestmentStatus) => {
    switch (status) {
      case InvestmentStatus.ACTIVE:
        return 'bg-green-50 text-green-700 border border-green-200'
      case InvestmentStatus.CONFIRMED:
        return 'bg-blue-50 text-blue-700 border border-blue-200'
      case InvestmentStatus.PENDING:
        return 'bg-yellow-50 text-yellow-700 border border-yellow-200'
      case InvestmentStatus.COMPLETED:
        return 'bg-purple-50 text-purple-700 border border-purple-200'
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200'
    }
  }

  const getTypeLabel = (type: PropertyType) => {
    return type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const activeInvestments = mockInvestments.filter((inv) => 
    inv.status === InvestmentStatus.ACTIVE || inv.status === InvestmentStatus.CONFIRMED
  )

  return (
    <ProtectedRoute>
      <Header />
      <main className="min-h-screen bg-white pt-16">
        {/* Page Header */}
        <section className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Investments</h1>
            <p className="text-gray-600">Track your portfolio performance and returns</p>
          </div>
        </section>

        {/* Portfolio Summary */}
        <section className="border-b border-gray-200 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Portfolio Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="text-sm text-gray-600 mb-1">Total Invested</div>
                <div className="text-2xl font-bold text-gray-900">{formatCurrency(portfolioSummary.totalInvested)}</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="text-sm text-gray-600 mb-1">Expected Returns</div>
                <div className="text-2xl font-bold text-green-600">{formatCurrency(portfolioSummary.totalExpectedReturns)}</div>
                <div className="text-xs text-gray-500 mt-1">Annual</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="text-sm text-gray-600 mb-1">Active Investments</div>
                <div className="text-2xl font-bold text-gray-900">{portfolioSummary.activeInvestments}</div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="text-sm text-gray-600 mb-1">Avg. Return</div>
                <div className="text-2xl font-bold text-gray-900">{portfolioSummary.averageReturn}%</div>
              </div>
            </div>
          </div>
        </section>

        {/* Active Investments */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Active Investments</h2>
            <Link
              href="/properties"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Browse Properties →
            </Link>
          </div>

          {activeInvestments.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500 mb-4">You don't have any active investments yet.</p>
              <Link
                href="/properties"
                className="inline-block bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Start Investing
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {activeInvestments.map((investment) => {
                const monthsRemaining = investment.property.investmentTerm - 
                  Math.floor((Date.now() - new Date(investment.purchaseDate).getTime()) / (1000 * 60 * 60 * 24 * 30))

                return (
                  <Link
                    key={investment.id}
                    href={`/properties/${investment.propertyId}`}
                    className="block bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-700 transition-colors">
                              {investment.property.title}
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span>{investment.property.address.city}, {investment.property.address.state}</span>
                              <span className="text-gray-300">•</span>
                              <span>{getTypeLabel(investment.property.propertyType)}</span>
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded text-xs font-medium ${getStatusBadgeColor(investment.status)}`}>
                            {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Invested</div>
                            <div className="text-sm font-semibold text-gray-900">{formatCurrency(investment.amountInvested)}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Shares</div>
                            <div className="text-sm font-semibold text-gray-900">{investment.shares}</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Expected Return</div>
                            <div className="text-sm font-semibold text-green-600">{formatCurrency(investment.expectedReturn || 0)}</div>
                            <div className="text-xs text-gray-500">per year</div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Term Remaining</div>
                            <div className="text-sm font-semibold text-gray-900">{monthsRemaining} months</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </section>
      </main>
    </ProtectedRoute>
  )
}

