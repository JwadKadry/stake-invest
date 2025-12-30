import { NextResponse } from 'next/server'
import connectDB from '@/lib/db/mongoose'
import Property from '@/models/Property'
import fs from 'fs'
import path from 'path'

async function seedProperties() {
  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'properties.local.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const properties = JSON.parse(fileContents)

    for (const prop of properties) {
      await Property.findOneAndUpdate(
        { id: prop.id },
        {
          id: prop.id,
          title: prop.title,
          description: prop.description,
          city: prop.city,
          state: prop.state,
          price: prop.price,
          minInvestment: prop.minInvestment,
          expectedYield: prop.expectedYield,
          fundedPercentage: prop.fundedPercentage,
          status: prop.status,
        },
        { upsert: true, new: true }
      )
    }
  } catch (error) {
    console.error('Error seeding properties:', error)
  }
}

export async function GET() {
  try {
    const db = await connectDB()

    if (db) {
      const properties = await Property.find({}).lean()

      if (properties.length === 0) {
        await seedProperties()
        const seededProperties = await Property.find({}).lean()
        return NextResponse.json({
          success: true,
          data: seededProperties,
        })
      }

      return NextResponse.json({
        success: true,
        data: properties,
      })
    }
  } catch (error) {
    console.error('Error fetching properties from MongoDB:', error)
  }

  try {
    const filePath = path.join(process.cwd(), 'public', 'data', 'properties.local.json')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const properties = JSON.parse(fileContents)

    return NextResponse.json({
      success: true,
      data: properties,
    })
  } catch (fallbackError) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to load properties',
      },
      { status: 500 }
    )
  }
}
