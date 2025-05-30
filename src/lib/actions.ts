"use server";

import { z } from "zod";
import type { Requirement, Priority, RiskLevel, RequirementStatus } from "./types";
import { suggestTags } from "@/ai/flows/suggest-tags"; // Assuming this path is correct

// Schema for new requirement input
const NewRequirementSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  riskLevel: z.enum(["Minimal", "Low", "Medium", "High", "Severe"]),
  owner: z.string().min(1, "Owner is required"),
  // Add other fields as necessary from Requirement type
});

export type NewRequirementInput = z.infer<typeof NewRequirementSchema>;

// In-memory store for demonstration purposes
let requirementsDB: Requirement[] = [
  {
    id: "REQ-001",
    title: "User Authentication System",
    description: "The system must allow users to register an account using their email and password. Upon successful registration, users should be able to log in to access protected areas of the application. Password recovery functionality must also be provided.",
    priority: "High",
    riskLevel: "Medium",
    owner: "Alice Wonderland",
    status: "Approved",
    tags: ["auth", "security", "phase-1", "user-management", "GDPR"],
    versions: [{ versionNumber: 1, description: "Initial draft", author: "Alice", timestamp: new Date().toISOString(), changes: "Created requirement" }],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];


export async function createRequirementAction(data: NewRequirementInput): Promise<{ success: boolean; requirement?: Requirement; error?: string; errors?: z.ZodIssue[] }> {
  const validationResult = NewRequirementSchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, errors: validationResult.error.errors };
  }

  const validatedData = validationResult.data;

  try {
    // Call AI to suggest tags
    const tagSuggestionsOutput = await suggestTags({ requirementText: validatedData.description });
    const suggestedAITags = tagSuggestionsOutput.suggestedTags || [];

    const newRequirement: Requirement = {
      id: `REQ-${String(requirementsDB.length + 1).padStart(3, '0')}`,
      ...validatedData,
      status: "Draft" as RequirementStatus, // Default status
      tags: [...new Set(suggestedAITags)], // Use AI suggested tags, ensure uniqueness
      versions: [{ versionNumber: 1, description: "Initial draft", author: validatedData.owner, timestamp: new Date().toISOString(), changes: "Created requirement" }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    requirementsDB.push(newRequirement);
    console.log("Created new requirement:", newRequirement);
    return { success: true, requirement: newRequirement };

  } catch (error) {
    console.error("Error creating requirement:", error);
    // Check if error is an instance of Error and has a message property
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while interacting with the AI service or saving the requirement.";
    return { success: false, error: errorMessage };
  }
}

export async function getRequirementsAction(): Promise<Requirement[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return requirementsDB;
}

export async function getRequirementByIdAction(id: string): Promise<Requirement | undefined> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  return requirementsDB.find(req => req.id === id);
}

export async function suggestTagsForDescriptionAction(description: string): Promise<string[]> {
  if (!description || description.trim().length < 10) {
    return []; // Don't call AI for very short descriptions
  }
  try {
    const result = await suggestTags({ requirementText: description });
    return result.suggestedTags || [];
  } catch (error) {
    console.error("Error suggesting tags:", error);
    return []; // Return empty on error or handle appropriately
  }
}

// Placeholder for Custom Field Definitions - in a real app, this would come from a DB or config
export async function getCustomFieldDefinitionsAction(): Promise<import("./types").CustomFieldDefinition[]> {
    return [
        { id: 'project', name: 'Project Name', type: 'text', placeholder: 'Enter project name', required: true },
        { id: 'module', name: 'Module', type: 'select', options: ['Core', 'Reporting', 'Integrations', 'UI/UX'], required: true },
        { id: 'targetRelease', name: 'Target Release', type: 'text', placeholder: 'e.g., Q4 2024' },
        { id: 'stakeholder', name: 'Key Stakeholder', type: 'text', placeholder: 'Name of stakeholder' },
    ];
}
