"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";

type TagSuggestionsProps = {
  suggestedTags: string[];
  currentTags: string[];
  setCurrentTags: Dispatch<SetStateAction<string[]>>;
  isLoading: boolean;
  onFetchSuggestions: () => void;
};

export function TagSuggestions({
  suggestedTags,
  currentTags,
  setCurrentTags,
  isLoading,
  onFetchSuggestions,
}: TagSuggestionsProps) {
  const handleAddTag = (tag: string) => {
    if (!currentTags.includes(tag)) {
      setCurrentTags([...currentTags, tag]);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setCurrentTags(currentTags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-3">
      <div>
        <h4 className="text-sm font-medium mb-1">Current Tags:</h4>
        {currentTags.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {currentTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-sm">
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1.5 text-muted-foreground hover:text-foreground"
                  aria-label={`Remove tag ${tag}`}
                >
                  &times;
                </button>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No tags added yet.</p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-medium">AI Suggested Tags:</h4>
          <Button type="button" variant="ghost" size="sm" onClick={onFetchSuggestions} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4 text-primary" />
            )}
            {isLoading ? "Fetching..." : "Refresh Suggestions"}
          </Button>
        </div>
        {isLoading && suggestedTags.length === 0 ? (
          <p className="text-xs text-muted-foreground">Loading suggestions...</p>
        ) : !isLoading && suggestedTags.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            No suggestions available. Type more in the description or click refresh.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {suggestedTags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                onClick={() => handleAddTag(tag)}
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground text-sm"
                title={`Add tag: ${tag}`}
              >
                {tag} +
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
