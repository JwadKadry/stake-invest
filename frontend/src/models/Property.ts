import mongoose, { Schema, Document } from 'mongoose'

export interface IProperty extends Document {
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
  imageUrl?: string
  createdAt?: Date
  updatedAt?: Date
}

const PropertySchema = new Schema<IProperty>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    minInvestment: {
      type: Number,
      required: true,
    },
    expectedYield: {
      type: Number,
      required: true,
    },
    fundedPercentage: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      required: true,
      default: 'listed',
    },
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

PropertySchema.set('toJSON', {
  transform: function (doc, ret) {
    delete ret._id
    delete ret.__v
    return ret
  },
})

const Property = mongoose.models.Property || mongoose.model<IProperty>('Property', PropertySchema)

export default Property

