import dotenv from "dotenv";

// dotenv.config({
//   path: ".env.development",
// });

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

console.log("ENV Loaded:", process.env.CLOUDINARY_API_KEY);
