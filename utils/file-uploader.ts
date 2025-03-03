import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generates a simplified file path for storage
 * @param familyId The family ID for organization
 * @returns A unique file path
 */
const generateFilePath = (familyId: string, date: Date): string => {
  // Generate UUID for filename
  const uuid = uuidv4();
  // Create date folder (YYYY-MM-DD)
  const dateFolder = date.toISOString().split('T')[0];
  // Combine into path with jpg extension (assuming only images)
  //(TODO: exie) need to add mime type to the file name
  return `${familyId}/${dateFolder}/${uuid}.jpg`;
};


export { generateFilePath };