import axios from "axios";

type UploadOptions = {
  onProgress?: (percentage: number) => void;
};

export async function uploadReportImage(file: File, options: UploadOptions = {}) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Photo upload is not configured. Add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET, or remove the photo.",
    );
  }

  const body = new FormData();
  body.append("file", file);
  body.append("upload_preset", uploadPreset);
  body.append("folder", "beacon/reports");

  const response = await axios.post<{ secure_url: string }>(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
    body,
    {
      onUploadProgress: (event) => {
        if (!event.total) return;
        options.onProgress?.(Math.round((event.loaded / event.total) * 100));
      },
    },
  );

  return response.data.secure_url;
}
