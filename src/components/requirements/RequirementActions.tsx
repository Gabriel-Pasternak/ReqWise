
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteRequirementAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { Edit3, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";


interface RequirementActionsProps {
  requirementId: string;
  listContext?: boolean; // True if used in the list view, false if in detail view
}

export function RequirementActions({ requirementId, listContext = true }: RequirementActionsProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteRequirementAction(requirementId);
      if (result.success) {
        toast({
          title: "Requirement Deleted",
          description: `Requirement ID ${requirementId} has been deleted.`,
        });
        // No need to router.refresh() if revalidatePath is used correctly in server action
        // For list context, the page will re-render.
        // For detail context, we might want to redirect.
        if (!listContext) {
            router.push("/requirements");
        }
      } else {
        toast({
          title: "Error Deleting Requirement",
          description: result.error || "Could not delete the requirement.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during deletion.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsAlertDialogOpen(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="icon" asChild title="Edit Requirement">
        <Link href={`/requirements/${requirementId}/edit`}>
          <Edit3 className="h-4 w-4" />
        </Link>
      </Button>
      <AlertDialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="icon" title="Delete Requirement" disabled={isDeleting}>
            {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the requirement (ID: {requirementId}).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
