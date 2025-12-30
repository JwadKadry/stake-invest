'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import { PropertyStatus } from '@/types/domains'
import { fetchPropertyById, mapPropertyStatus, PropertyData } from '@/lib/data/properties'

interface Property {
  id: string
  title: string
  description: string
  city: string
  state: string
  price: number
  minInvestment: number
  expectedYield: number
  fundedPercentage: number
  status: PropertyStatus
}

export default function PropertyDetailPage() {
  const params = useParams()
  const id = typeof params.id === 'string' ? params.id : params.id?.[0] || ''
  const router = useRouter()
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [investmentAmount, setInvestmentAmount] = useState(0)
  const [isInvesting, setIsInvesting] = useState(false)

  useEffect(() => {
    async function loadProperty() {
      if (!id) {
        setError('Property ID is required')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchPropertyById(id)
        if (data) {
          const mappedProperty: Property = {
            id: data.id,
            title: data.title,
            description: data.description,
            city: data.city,
            state: data.state,
            price: data.price,
            minInvestment: data.minInvestment,
            expectedYield: data.expectedYield,
            fundedPercentage: data.fundedPercentage,
            status: mapPropertyStatus(data.status),
          }
          setProperty(mappedProperty)
          setInvestmentAmount(data.minInvestment)
        } else {
          setError('Property not found')
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load property')
      } finally {
        setIsLoading(false)
      }
    }

    loadProperty()
  }, [id])

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <p className="text-gray-500 text-lg">Loading property...</p>
          </div>
        </main>
      </>
    )
  }

  if (error || !property) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-white pt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || 'Property Not Found'}
            </h1>
            <Link href="/properties" className="text-gray-900 hover:text-gray-700">
              ← Back to Properties
            </Link>
          </div>
        </main>
      </>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleInvest = async () => {
    setIsInvesting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsInvesting(false)
    alert('Investment submitted successfully!')
    router.push('/investments')
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/properties" className="text-gray-600 hover:text-gray-900 mb-6 inline-block text-sm">
            ← Back to Properties
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-96 bg-gray-100 rounded-lg"></div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{property.title}</h1>
                <div className="flex items-center gap-2 text-gray-600 mb-6">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{property.city}, {property.state}</span>
                </div>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Total Value</div>
                  <div className="text-xl font-semibold text-gray-900">{formatCurrency(property.price)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Expected Yield</div>
                  <div className="text-xl font-semibold text-green-600">{property.expectedYield}%</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Minimum Investment</div>
                  <div className="text-xl font-semibold text-gray-900">{formatCurrency(property.minInvestment)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Status</div>
                  <div className="text-xl font-semibold text-gray-900 capitalize">{property.status}</div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Invest Now</h2>

                {property.fundedPercentage > 0 && (
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Funding Progress</span>
                      <span>{property.fundedPercentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className="bg-gray-900 h-2 rounded-full"
                        style={{ width: `${property.fundedPercentage}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Investment Amount
                  </label>
                  <input
                    type="number"
                    min={property.minInvestment}
                    step={1000}
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Minimum: {formatCurrency(property.minInvestment)}
                  </p>
                </div>

                <div className="mb-6 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Expected Annual Return</span>
                    <span className="font-semibold text-green-600">{property.expectedYield}%</span>
                  </div>
                </div>

                <button
                  onClick={handleInvest}
                  disabled={isInvesting || investmentAmount < property.minInvestment}
                  className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isInvesting ? 'Processing...' : 'Invest Now'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  All investments are subject to terms and conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
