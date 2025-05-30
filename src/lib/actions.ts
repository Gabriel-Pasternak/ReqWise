
"use server";

import { z } from "zod";
import type { Requirement, Priority, RiskLevel, RequirementStatus, CustomFieldDefinition } from "./types";
import { suggestTags } from "@/ai/flows/suggest-tags";
import { revalidatePath } from "next/cache";

// Schema for new/edit requirement input
const RequirementDataSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["Low", "Medium", "High", "Critical"]),
  riskLevel: z.enum(["Minimal", "Low", "Medium", "High", "Severe"]),
  owner: z.string().min(1, "Owner is required"),
  status: z.enum(["Draft", "In Review", "Approved", "Implemented", "Verified", "Obsolete"]).optional(),
  tags: z.array(z.string()).optional(),
  customFields: z.record(z.any()).optional(),
});

export type RequirementDataInput = z.infer<typeof RequirementDataSchema>;

// In-memory store for demonstration purposes
let requirementsDB: Requirement[] = [];
let nextId = 1;

export async function createRequirementAction(data: RequirementDataInput): Promise<{ success: boolean; requirement?: Requirement; error?: string; errors?: z.ZodIssue[] }> {
  const validationResult = RequirementDataSchema.safeParse(data);
  if (!validationResult.success) {
    return { success: false, errors: validationResult.error.errors };
  }

  const validatedData = validationResult.data;

  try {
    const tagSuggestionsOutput = await suggestTags({ requirementText: validatedData.description });
    const suggestedAITags = tagSuggestionsOutput.suggestedTags || [];
    const finalTags = data.tags ? [...new Set([...data.tags, ...suggestedAITags])] : [...new Set(suggestedAITags)];


    const newRequirement: Requirement = {
      id: `REQ-${String(nextId++).padStart(3, '0')}`,
      title: validatedData.title,
      description: validatedData.description,
      priority: validatedData.priority as Priority,
      riskLevel: validatedData.riskLevel as RiskLevel,
      owner: validatedData.owner,
      customFields: validatedData.customFields || {},
      status: (validatedData.status || "Draft") as RequirementStatus,
      tags: finalTags,
      versions: [{ versionNumber: 1, description: "Initial draft", author: validatedData.owner, timestamp: new Date().toISOString(), changes: "Created requirement" }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    requirementsDB.push(newRequirement);
    console.log("Created new requirement:", newRequirement.id);
    revalidatePath("/requirements");
    revalidatePath("/");
    return { success: true, requirement: newRequirement };

  } catch (error) {
    console.error("Error creating requirement:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while interacting with the AI service or saving the requirement.";
    return { success: false, error: errorMessage };
  }
}

export async function getRequirementsAction(): Promise<Requirement[]> {
  // Simulate API delay if needed, but for now, direct return
  // await new Promise(resolve => setTimeout(resolve, 100));
  return JSON.parse(JSON.stringify(requirementsDB)); // Return a copy
}

export async function getRequirementByIdAction(id: string): Promise<Requirement | undefined> {
  // await new Promise(resolve => setTimeout(resolve, 100));
  const requirement = requirementsDB.find(req => req.id === id);
  return requirement ? JSON.parse(JSON.stringify(requirement)) : undefined; // Return a copy
}

export async function deleteRequirementAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const initialLength = requirementsDB.length;
    requirementsDB = requirementsDB.filter(req => req.id !== id);
    if (requirementsDB.length < initialLength) {
      console.log("Deleted requirement:", id);
      revalidatePath("/requirements");
      revalidatePath("/");
      revalidatePath(`/requirements/${id}`);
      return { success: true };
    }
    return { success: false, error: "Requirement not found." };
  } catch (error) {
    console.error("Error deleting requirement:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred while deleting the requirement.";
    return { success: false, error: errorMessage };
  }
}

// Placeholder for update - full implementation would involve a form and more logic
export async function updateRequirementAction(id: string, data: Partial<RequirementDataInput>): Promise<{ success: boolean; requirement?: Requirement; error?: string; errors?: z.ZodIssue[] }> {
  const requirementIndex = requirementsDB.findIndex(req => req.id === id);
  if (requirementIndex === -1) {
    return { success: false, error: "Requirement not found." };
  }

  const existingRequirement = requirementsDB[requirementIndex];
  
  // For a full update, you'd validate `data` against a schema for partial updates
  // and carefully merge, handling versions, etc.
  // This is a simplified update for now.
  const updatedRequirement = {
    ...existingRequirement,
    ...data, // Naively merge data
    updatedAt: new Date().toISOString(),
  };

  // If description changed, new tags could be suggested.
  // If significant fields changed, a new version should be created.
  // This logic is omitted for brevity in this step.
  
  requirementsDB[requirementIndex] = updatedRequirement;
  console.log("Updated requirement:", id);
  revalidatePath("/requirements");
  revalidatePath("/");
  revalidatePath(`/requirements/${id}`);
  return { success: true, requirement: updatedRequirement };
}


export async function suggestTagsForDescriptionAction(description: string): Promise<string[]> {
  if (!description || description.trim().length < 10) {
    return [];
  }
  try {
    const result = await suggestTags({ requirementText: description });
    return result.suggestedTags || [];
  } catch (error) {
    console.error("Error suggesting tags:", error);
    return [];
  }
}

export async function getCustomFieldDefinitionsAction(): Promise<CustomFieldDefinition[]> {
    return [
        { id: 'project', name: 'Project Name', type: 'text', placeholder: 'Enter project name', required: true },
        { id: 'module', name: 'Module', type: 'select', options: ['Core', 'Reporting', 'Integrations', 'UI/UX'], required: true },
        { id: 'targetRelease', name: 'Target Release', type: 'text', placeholder: 'e.g., Q4 2024' },
        { id: 'stakeholder', name: 'Key Stakeholder', type: 'text', placeholder: 'Name of stakeholder' },
    ];
}
