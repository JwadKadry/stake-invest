'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import { PropertyStatus } from '@/types/domains'
import { fetchProperties, mapPropertyStatus, PropertyData } from '@/lib/data/properties'

interface PropertyCard {
  id: string
  title: string
  city: string
  state: string
  price: number
  minInvestment: number
  expectedYield: number
  fundedPercentage: number
  status: PropertyStatus
}

export default function PropertiesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<PropertyStatus | 'all'>('all')
  const [properties, setProperties] = useState<PropertyCard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadProperties() {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchProperties()
        const mappedProperties: PropertyCard[] = data.map((p: PropertyData) => ({
          id: p.id,
          title: p.title,
          city: p.city,
          state: p.state,
          price: p.price,
          minInvestment: p.minInvestment,
          expectedYield: p.expectedYield,
          fundedPercentage: p.fundedPercentage,
          status: mapPropertyStatus(p.status),
        }))
        setProperties(mappedProperties)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load properties')
      } finally {
        setIsLoading(false)
      }
    }

    loadProperties()
  }, [])

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.state.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === 'all' || property.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusBadgeColor = (status: PropertyStatus) => {
    switch (status) {
      case PropertyStatus.LISTED:
        return 'bg-green-50 text-green-700'
      case PropertyStatus.FUNDING:
        return 'bg-blue-50 text-blue-700'
      case PropertyStatus.FUNDED:
        return 'bg-purple-50 text-purple-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-16">
        {/* Page Header */}
        <section className="border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Properties</h1>
            <p className="text-gray-600">Browse and invest in premium real estate opportunities</p>
          </div>
        </section>

        {/* Filters */}
        <section className="border-b border-gray-200 sticky top-16 z-40 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search properties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <svg
                    className="absolute left-3 top-3 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as PropertyStatus | 'all')}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value={PropertyStatus.LISTED}>Listed</option>
                <option value={PropertyStatus.FUNDING}>Funding</option>
                <option value={PropertyStatus.FUNDED}>Funded</option>
              </select>
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Loading properties...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-gray-900 hover:text-gray-700 font-medium"
              >
                Try Again
              </button>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => (
                <Link
                  key={property.id}
                  href={`/properties/${property.id}`}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all group"
                >
                  <div className="relative h-40 bg-gray-100">
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadgeColor(property.status)}`}>
                        {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors line-clamp-2">
                      {property.title}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{property.city}, {property.state}</span>
                    </div>

                    <div className="space-y-2.5 mb-4 pb-4 border-b border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Price</span>
                        <span className="text-sm font-semibold text-gray-900">{formatCurrency(property.minInvestment)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Yield</span>
                        <span className="text-sm font-semibold text-green-600">{property.expectedYield}%</span>
                      </div>
                    </div>

                    {property.fundedPercentage > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                          <span>Funded</span>
                          <span>{property.fundedPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5">
                          <div
                            className="bg-gray-900 h-1.5 rounded-full"
                            style={{ width: `${property.fundedPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="text-sm font-medium text-gray-900 text-center py-2">
                      View Details →
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}

