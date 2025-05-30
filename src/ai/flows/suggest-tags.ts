'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting tags for requirements based on their content.
 *
 * The flow uses NLP to analyze the requirement and suggest tags related to project phase, module, and regulatory standards.
 *
 * @fileOverview
 * - suggestTags - A function that suggests tags for a given requirement.
 * - SuggestTagsInput - The input type for the suggestTags function.
 * - SuggestTagsOutput - The output type for the suggestTags function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestTagsInputSchema = z.object({
  requirementText: z
    .string()
    .describe('The text of the requirement to suggest tags for.'),
});
export type SuggestTagsInput = z.infer<typeof SuggestTagsInputSchema>;

const SuggestTagsOutputSchema = z.object({
  suggestedTags: z
    .array(z.string())
    .describe(
      'An array of suggested tags for the requirement, including project phase, module, and regulatory standards.'
    ),
});
export type SuggestTagsOutput = z.infer<typeof SuggestTagsOutputSchema>;

export async function suggestTags(input: SuggestTagsInput): Promise<SuggestTagsOutput> {
  return suggestTagsFlow(input);
}

const suggestTagsPrompt = ai.definePrompt({
  name: 'suggestTagsPrompt',
  input: {schema: SuggestTagsInputSchema},
  output: {schema: SuggestTagsOutputSchema},
  prompt: `You are an AI assistant that suggests tags for requirements.  You will receive the text of a requirement and suggest tags related to project phase, module, and regulatory standards.  Return the tags as a JSON array of strings.

Requirement:
{{requirementText}}`,
});

const suggestTagsFlow = ai.defineFlow(
  {
    name: 'suggestTagsFlow',
    inputSchema: SuggestTagsInputSchema,
    outputSchema: SuggestTagsOutputSchema,
  },
  async input => {
    const {output} = await suggestTagsPrompt(input);
    return output!;
  }
);
