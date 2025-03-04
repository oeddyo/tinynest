import "react-native-get-random-values"
import { nanoid } from "nanoid"

/**
 * Generates a simplified file path for storage
 * @param familyId The family ID
 * @param date The date for organizing files (defaults to current date)
 * @returns A unique file path
 */
export const generateFilePath = (
  familyId: string,
  date: Date = new Date()
): string => {
  // Format date as YYYY-MM-DD
  const formattedDate = date.toISOString().split("T")[0]

  // Generate a unique ID for the file (shorter than UUID)
  const uniqueId = nanoid(10) // 10 characters is usually sufficient

  // Construct the path: familyId/YYYY-MM-DD/uniqueId
  return `${familyId}/${formattedDate}/${uniqueId}`
}
