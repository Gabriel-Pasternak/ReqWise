"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { TagSuggestions } from "./TagSuggestions";
import { FileUpload } from "../shared/FileUpload";
import { priorities, riskLevels, type Priority, type RiskLevel, type CustomFieldDefinition } from "@/lib/types";
import { createRequirementAction, suggestTagsForDescriptionAction, getCustomFieldDefinitionsAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Loader2, Save } from "lucide-react";

const requirementFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  priority: z.enum(priorities),
  riskLevel: z.enum(riskLevels),
  owner: z.string().min(2, { message: "Owner name must be at least 2 characters." }),
  customFields: z.record(z.any()).optional(),
});

type RequirementFormValues = z.infer<typeof requirementFormSchema>;

export function RequirementForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiSuggestedTags, setAiSuggestedTags] = useState<string[]>([]);
  const [currentTags, setCurrentTags] = useState<string[]>([]);
  const [isSuggestingTags, setIsSuggestingTags] = useState(false);
  const [customFieldDefs, setCustomFieldDefs] = useState<CustomFieldDefinition[]>([]);

  const form = useForm<RequirementFormValues>({
    resolver: zodResolver(requirementFormSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "Medium",
      riskLevel: "Low",
      owner: "",
      customFields: {},
    },
  });

  useEffect(() => {
    async function fetchCustomFields() {
        const defs = await getCustomFieldDefinitionsAction();
        setCustomFieldDefs(defs);
        const defaultCustomValues: Record<string, any> = {};
        defs.forEach(def => {
            if (def.type === 'select' && def.options && def.options.length > 0) {
                defaultCustomValues[def.id] = def.options[0]; // Default to first option
            } else {
                defaultCustomValues[def.id] = "";
            }
        });
        form.setValue('customFields', defaultCustomValues);
    }
    fetchCustomFields();
  }, [form]);


  const fetchTagSuggestions = useCallback(async () => {
    const description = form.getValues("description");
    if (description && description.length >= 10) {
      setIsSuggestingTags(true);
      try {
        const tags = await suggestTagsForDescriptionAction(description);
        setAiSuggestedTags(tags);
      } catch (error) {
        console.error("Failed to fetch tag suggestions:", error);
        toast({ title: "Error", description: "Could not fetch AI tag suggestions.", variant: "destructive" });
      } finally {
        setIsSuggestingTags(false);
      }
    } else {
      setAiSuggestedTags([]);
    }
  }, [form, toast]);

  // Debounced fetch for tag suggestions
  useEffect(() => {
    const description = form.watch("description");
    if (!description || description.length < 10) {
      setAiSuggestedTags([]); // Clear suggestions if description is too short
      return;
    }
    const timer = setTimeout(() => {
      fetchTagSuggestions();
    }, 1000); // Debounce for 1 second
    return () => clearTimeout(timer);
  }, [form.watch("description"), fetchTagSuggestions]);


  async function onSubmit(data: RequirementFormValues) {
    setIsSubmitting(true);
    try {
      // Here, you would augment `data` with `currentTags` before sending to the action
      const submissionData = { ...data, tags: currentTags }; 
      const result = await createRequirementAction(submissionData);

      if (result.success && result.requirement) {
        toast({
          title: "Requirement Created",
          description: `Requirement "${result.requirement.title}" has been successfully created.`,
        });
        router.push("/requirements"); // Or to the new requirement's detail page: /requirements/${result.requirement.id}
      } else {
        const errorMsg = result.error || "Failed to create requirement.";
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
        if (result.errors) {
          result.errors.forEach((err) => {
            form.setError(err.path.join(".") as keyof RequirementFormValues, { message: err.message });
          });
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  const renderCustomField = (fieldDef: CustomFieldDefinition) => {
    const fieldName = `customFields.${fieldDef.id}` as const;
    return (
      <FormField
        key={fieldDef.id}
        control={form.control}
        name={fieldName}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{fieldDef.name}{fieldDef.required &&<span className="text-destructive">*</span>}</FormLabel>
            {fieldDef.type === 'select' && fieldDef.options ? (
              <Select onValueChange={field.onChange} defaultValue={field.value || fieldDef.options[0]}>
                <FormControl>
                  <SelectTrigger><SelectValue placeholder={fieldDef.placeholder || `Select ${fieldDef.name}`} /></SelectTrigger>
                </FormControl>
                <SelectContent>
                  {fieldDef.options.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <FormControl>
                <Input type={fieldDef.type === 'number' ? 'number' : fieldDef.type === 'date' ? 'date' : 'text'} placeholder={fieldDef.placeholder} {...field} />
              </FormControl>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Core Fields & Custom Fields */}
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Requirement Details</CardTitle>
                <CardDescription>Provide the core information for the requirement.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl><Input placeholder="e.g., User Login Functionality" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl><Textarea placeholder="Detailed description of the requirement..." {...field} rows={6} /></FormControl>
                      <FormDescription>Be as specific as possible. AI will suggest tags based on this.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 {customFieldDefs.length > 0 && (
                  <>
                    <Separator className="my-6" />
                    <h3 className="text-lg font-medium">Additional Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {customFieldDefs.map(renderCustomField)}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Attributes, Tags, File Upload */}
          <div className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Attributes</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="riskLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risk Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select risk level" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {riskLevels.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="owner"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner</FormLabel>
                      <FormControl><Input placeholder="e.g., Jane Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Context Tagging</CardTitle></CardHeader>
              <CardContent>
                <TagSuggestions
                  suggestedTags={aiSuggestedTags}
                  currentTags={currentTags}
                  setCurrentTags={setCurrentTags}
                  isLoading={isSuggestingTags}
                  onFetchSuggestions={fetchTagSuggestions}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>File Attachments</CardTitle></CardHeader>
              <CardContent>
                <FileUpload />
                 <FormDescription className="mt-2 text-xs">
                  Attach related documents or import requirements from CSV/Excel.
                </FormDescription>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting} size="lg">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-2 h-4 w-4" />
            Save Requirement
          </Button>
        </div>
      </form>
    </Form>
  );
}
