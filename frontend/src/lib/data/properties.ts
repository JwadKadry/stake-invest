import { PropertyStatus } from '@/types/domains'

export interface PropertyData {
  id: string
  title: string
  description: string
  city: string
  state: string
  price: number
  minInvestment: number
  expectedYield: number
  fundedPercentage: number
  status: string
}

interface ExternalPropertyData {
  [key: string]: unknown
}

let cachedProperties: PropertyData[] | null = null

function normalizeExternalData(data: unknown[]): PropertyData[] {
  if (!Array.isArray(data)) {
    return []
  }

  return data
    .map((item: ExternalPropertyData, index: number) => {
      try {
        const normalized: PropertyData = {
          id: String(item.id || item.מספר_נכס || item.property_id || `ext-${index + 1}`),
          title: String(item.title || item.שם_נכס || item.property_name || item.name || 'Property'),
          description: String(
            item.description ||
              item.תיאור ||
              item.property_description ||
              item.desc ||
              'Investment property opportunity'
          ),
          city: String(item.city || item.עיר || item.property_city || 'Unknown'),
          state: String(item.state || item.מדינה || item.property_state || 'Unknown'),
          price: Number(item.price || item.מחיר || item.property_value || item.total_value || 0),
          minInvestment: Number(
            item.minInvestment ||
              item.השקעה_מינימלית ||
              item.min_investment ||
              item.minimum_investment ||
              1000
          ),
          expectedYield: Number(
            item.expectedYield ||
              item.תשואה_צפויה ||
              item.expected_yield ||
              item.annual_return ||
              7.0
          ),
          fundedPercentage: Number(
            item.fundedPercentage ||
              item.אחוז_מימון ||
              item.funded_percentage ||
              item.funding_progress ||
              0
          ),
          status: String(item.status || item.סטטוס || item.property_status || 'listed'),
        }

        if (normalized.price > 0 && normalized.title !== 'Property') {
          return normalized
        }
        return null
      } catch (error) {
        console.warn('Failed to normalize property item:', error)
        return null
      }
    })
    .filter((item): item is PropertyData => item !== null)
}

async function fetchFromExternalSource(): Promise<PropertyData[] | null> {
  try {
    const externalEndpoints = [
      'https://data.gov.il/api/3/action/datastore_search?resource_id=real-estate-properties',
      'https://data.gov.il/api/3/action/datastore_search?resource_id=properties',
    ]

    for (const endpoint of externalEndpoints) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(endpoint, {
          signal: controller.signal,
          headers: {
            Accept: 'application/json',
          },
        })

        clearTimeout(timeoutId)

        if (response.ok) {
          const result = await response.json()
          if (result.result && result.result.records) {
            const normalized = normalizeExternalData(result.result.records)
            if (normalized.length > 0) {
              return normalized
            }
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.warn(`Failed to fetch from ${endpoint}:`, error.message)
        }
        continue
      }
    }

    return null
  } catch (error) {
    console.warn('External data fetch failed:', error)
    return null
  }
}

async function fetchFromInternalAPI(): Promise<PropertyData[]> {
  try {
    const response = await fetch('/api/properties', {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch properties: ${response.statusText}`)
    }

    const result = await response.json()
    if (result.success && result.data) {
      return result.data as PropertyData[]
    }
    throw new Error('Invalid API response format')
  } catch (error) {
    console.error('Error fetching from internal API:', error)
    throw error
  }
}

export async function fetchProperties(): Promise<PropertyData[]> {
  if (cachedProperties) {
    return cachedProperties
  }

  try {
    const externalData = await fetchFromExternalSource()
    if (externalData && externalData.length > 0) {
      cachedProperties = externalData
      return externalData
    }
  } catch (error) {
    console.warn('External fetch failed, falling back to internal API:', error)
  }

  try {
    const apiData = await fetchFromInternalAPI()
    cachedProperties = apiData
    return apiData
  } catch (error) {
    console.error('Error fetching properties:', error)
    throw error
  }
}

export async function fetchPropertyById(id: string): Promise<PropertyData | null> {
  try {
    const response = await fetch(`/api/properties/${id}`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      throw new Error(`Failed to fetch property: ${response.statusText}`)
    }

    const result = await response.json()
    if (result.success && result.data) {
      return result.data as PropertyData
    }
    return null
  } catch (error) {
    console.error('Error fetching property by id:', error)
    return null
  }
}

export function mapPropertyStatus(status: string): PropertyStatus {
  switch (status.toLowerCase()) {
    case 'listed':
    case 'רשום':
      return PropertyStatus.LISTED
    case 'funding':
    case 'מימון':
      return PropertyStatus.FUNDING
    case 'funded':
    case 'מומן':
      return PropertyStatus.FUNDED
    case 'closed':
    case 'סגור':
      return PropertyStatus.CLOSED
    default:
      return PropertyStatus.DRAFT
  }
}

