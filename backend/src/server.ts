import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { errorHandler } from './shared/middleware/errorHandler'
import { authRoutes } from './domains/users/routes/authRoutes'
import { userRoutes } from './domains/users/routes/userRoutes'
import { propertyRoutes } from './domains/properties/routes/propertyRoutes'
import { investmentRoutes } from './domains/investments/routes/investmentRoutes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/properties', propertyRoutes)
app.use('/api/investments', investmentRoutes)

// Error handling
app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})

