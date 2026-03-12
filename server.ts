import dotenv from "dotenv";

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

// fallback if environment-specific file doesn't exist
dotenv.config();

//! To run the backend for DEVELOPMENT -> npm run server
//! To run the backend for PRODUCTION -> npm start

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";

import connectDB from "./config/db.js";

import ProductRouter from "./routes/productsRoutes.js";
import CartRouter from "./routes/cartRoutes.js";
import OrderRouter from "./routes/ordersRoutes.js";
import AddressRouter from "./routes/addressRoutes.js";
import WishlistRouter from "./routes/wishlistRoutes.js";
import AdminRouter from "./routes/adminRoutes.js";
// import paymentRouter from "./routes/paymentRoute.js";

import { clerkWebhook } from "./controllers/webhooks.js";
// import { handleStripeWebhook } from "./controllers/paymentController.js";

import makeAdmin from "./scripts/makeAdmin.js";
import { seedProducts } from "./scripts/seedProducts.js";

const app = express();
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Connect database
    await connectDB();

    /*
    ========================
    Webhooks (before JSON)
    ========================
    */

    app.post(
      "/api/clerk",
      express.raw({ type: "application/json" }),
      clerkWebhook,
    );

    // if (process.env.STRIPE_SECRET_KEY) {
    //   app.post(
    //     "/api/stripe",
    //     express.raw({ type: "application/json" }),
    //     handleStripeWebhook,
    //   );
    // }

    /*
    ========================
    Middleware
    ========================
    */

    app.use(cors());
    app.use(express.json());
    app.use(clerkMiddleware());

    /*
    ========================
    Routes
    ========================
    */

    app.get("/", (req: Request, res: Response) => {
      res.send("🚀 Backend Server Running");
    });

    app.use("/api/products", ProductRouter);
    app.use("/api/cart", CartRouter);
    app.use("/api/orders", OrderRouter);
    app.use("/api/addresses", AddressRouter);
    app.use("/api/wishlist", WishlistRouter);
    app.use("/api/admin", AdminRouter);

    // if (process.env.STRIPE_SECRET_KEY) {
    //   app.use("/api/payments", paymentRouter);
    // }

    /*
    ========================
    Scripts
    ========================
    */

    await makeAdmin();

    await seedProducts(process.env.MONGODB_URI as string);

    /*
    ========================
    Global Error Handler
    ========================
    */

    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);

      res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
      });
    });

    /*
    ========================
    Start Server
    ========================
    */

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
}

startServer();
