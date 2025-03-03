/**
 * Represents a media item (photo or video) in the application
 * Corresponds to the media_items table in the database
 */
export enum MediaType {
  Photo = 'photo',
  Video = 'video'
}

export interface MediaItem {
  // Database fields
  id?: string;                  // UUID, optional when creating new items
  familyId: string;             // References families table
  uploaderId: string;           // References auth.users table
  mediaType: MediaType;         // Enum: 'photo' or 'video'
  storagePath: string;          // Path in storage bucket
  fileName: string;             // Original file name
  sizeBytes: number;            // File size in bytes
  mimeType: string;             // MIME type (e.g., "image/jpeg", "video/mp4")
  
  // Optional fields
  caption?: string;             // User-provided caption
  createdAt?: string;           // Timestamp, optional when creating
  
  // Media-specific metadata (nullable)
  width?: number;               // Image/video width in pixels
  height?: number;              // Image/video height in pixels
  durationSeconds?: number;     // Video duration in seconds
  thumbnailPath?: string;       // Path to thumbnail image for videos
  
  // Client-side only fields (not stored in database)
  uri?: string;                 // Local URI for display/upload (not stored)
  url?: string;                 // Public URL for display (derived from storagePath)
}