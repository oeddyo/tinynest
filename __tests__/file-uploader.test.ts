import { generateFilePath } from "../utils/file-uploader";

// Mock nanoid to return predictable values
jest.mock("nanoid", () => ({
  nanoid: () => "abc123xyz",
}));

describe("generateFilePath", () => {
  it("should use the provided date if specified", () => {
    const familyId = "family123";
    const customDate = new Date("2022-06-15T00:00:00Z");
    const path = generateFilePath(familyId, customDate);

    // Check the complete path with custom date
    expect(path).toBe("family123/2022-06-15/abc123xyz");
  });
});
