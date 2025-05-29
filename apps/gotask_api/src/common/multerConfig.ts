import multer from "multer";
import { ErrorRequestHandler } from "express";

// Configure multer for file uploads
export const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 10 * 1024 * 1024 // Limit file size to 10MB
  }
});

// Multer error handling middleware
export const handleMulterError: ErrorRequestHandler = (err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      console.error(`Unexpected field: ${err.field}. Expected 'file'.`);
      res.status(400).json({
        error: `Unexpected field name. Expected 'file', but received '${err.field}'`
      });
    } else {
      console.error(`Multer error: ${err.message}`);
      res.status(400).json({ error: err.message });
    }
  } else if (err) {
    console.error(`File upload error: ${err.message}`);
    res.status(500).json({ error: "File upload failed", details: err.message });
  } else {
    next(); // Pass to next middleware if no error
  }
};
