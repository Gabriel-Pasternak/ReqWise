export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type RiskLevel = 'Minimal' | 'Low' | 'Medium' | 'High' | 'Severe';
export type RequirementStatus = 'Draft' | 'In Review' | 'Approved' | 'Implemented' | 'Verified' | 'Obsolete';

export const priorities: Priority[] = ['Low', 'Medium', 'High', 'Critical'];
export const riskLevels: RiskLevel[] = ['Minimal', 'Low', 'Medium', 'High', 'Severe'];
export const requirementStatuses: RequirementStatus[] = ['Draft', 'In Review', 'Approved', 'Implemented', 'Verified', 'Obsolete'];


export interface CustomFieldDefinition {
  id: string;
  name: string;
  type: 'text' | 'select' | 'number' | 'date';
  options?: string[]; // For select type
  validationRules?: string; // Could be a string representation of Zod schema or specific rules
  placeholder?: string;
  required?: boolean;
}

export interface RequirementVersion {
  versionNumber: number;
  description: string;
  author: string;
  timestamp: string; // ISO date string
  changes: string; // Description of changes from previous version
}

export interface Requirement {
  id: string;
  title: string;
  description: string; // Main requirement text
  priority: Priority;
  riskLevel: RiskLevel;
  owner: string;
  status: RequirementStatus;
  tags: string[];
  customFields?: Record<string, any>; // Key-value for custom fields based on CustomFieldDefinition
  versions: RequirementVersion[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  dependencies?: string[]; // IDs of other requirements
  affectedDocs?: string[]; // Names or IDs of affected documents/test cases
  projectId?: string; // Associated project
  moduleId?: string; // Associated module
  regulatoryStandard?: string; // Applicable standard
}

export interface ProjectMilestone {
  id: string;
  name:string;
  date: string; // ISO date string
  description?: string;
}
