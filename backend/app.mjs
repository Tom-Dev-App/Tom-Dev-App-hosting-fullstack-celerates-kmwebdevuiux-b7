import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import categoryRoutes from './routes/categoryRoutes.mjs'
import productRoutes from './routes/productRoutes.mjs'
import categoryRoutesV2 from './routes/categoryRoutesV2.mjs'
import path from 'path'
import cookieParser from 'cookie-parser'
import expressSession from 'express-session'
import passport from 'passport'
import 'dotenv/config'
import configurePassport from './config/passport.mjs'
import authRoutes from './routes/auth-routes.mjs'
import 'dotenv/config'


const app = express()
const PORT =  process.env.NODE_PORT || 8000

// Middleware
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))



const allowedOrigins = [
  process.env.FRONTEND_URL ?? "http://localhost:5173",
];

// Dynamic CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true); // Origin is allowed
      } else {
        callback(new Error("Not allowed by CORS")); // Origin is not allowed
      }
    },
    credentials: true,
    methods: "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    allowedHeaders: "Authorization, Content-Type",
  })
);

// Options request handler for preflight
app.options("*", (req, res) => {
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});


app.use(
  passport.session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
  })
)
app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);


// ROUTING
app.get('/', (req, res, next) => {
  // res.json({data: `Hello World`})
  res.send('Hello World')
})

// static routes
app.use("/public", express.static(path.join(process.cwd(), "public")));
app.use('/api/v1/auth', authRoutes)
// Routing wrapping dengan app.use entry point domain/api/v1/categories/
app.use('/api/v1/categories', categoryRoutes)
app.use('/api/v2/categories', categoryRoutesV2)

app.use('/api/v1/products', productRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT} http://localhost:${PORT}/`)
})