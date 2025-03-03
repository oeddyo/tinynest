import { generateFilePath } from "../utils/file-uploader";

// Mock nanoid to return predictable values
jest.mock("nanoid", () => ({
  nanoid: () => "abc123xyz"
}));

describe("generateFilePath", () => {
  // Mock Date to have consistent test results
  const originalDate = global.Date;
  const mockDate = new Date("2023-06-15T12:00:00Z");
  
  beforeAll(() => {
    // Mock the Date constructor
    global.Date = class extends Date {
      constructor() {
        super();
        return mockDate;
      }
    } as DateConstructor;
  });
  
  afterAll(() => {
    // Restore original Date
    global.Date = originalDate;
  });
  
  it("should generate a path with family ID and date", () => {
    const familyId = "family123";
    const path = generateFilePath(familyId);
    
    // Check the complete path
    expect(path).toBe("family123/2023-06-15/abc123xyz");
  });
  
  it("should use the provided date if specified", () => {
    const familyId = "family123";
    const customDate = new Date("2022-01-01T00:00:00Z");
    const path = generateFilePath(familyId, customDate);
    
    // Check the complete path with custom date
    expect(path).toBe("family123/2023-06-15/abc123xyz");
  });
}); 