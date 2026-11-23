import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

const bufferToStream = (buffer) => {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null);
  return readable;
};

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "persona" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      bufferToStream(req.file.buffer).pipe(stream);
    });

    res.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    next(error);
  }
};