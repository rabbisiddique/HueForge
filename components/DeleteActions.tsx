"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { CircleCheck, Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

interface DeleteActionsProps<T> {
  component: T;
  apiEndpoint: string; // axios endpoint to hit
  onDelete?: (id: string) => void; // optional callback after delete
  title?: string;
  description?: string;
}

const DeleteActions = <T extends { id: string; componentName: string }>({
  component,
  apiEndpoint,
  onDelete,
  title,
  description,
}: DeleteActionsProps<T>) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const { data } = await axios.delete(apiEndpoint, {
        data: { deleteId: component.id },
      });

      toast(
        data?.message || `${component.componentName} deleted successfully!`,
        {
          icon: <CircleCheck className="w-4 h-4 text-green-500" />,
        }
      );

      if (onDelete) onDelete(component.id);
    } catch (err: any) {
      console.error(err);
      toast(
        err.response?.data?.error || "Something went wrong while deleting.",
        {
          icon: <XCircle className="w-4 h-4 text-red-500" />,
        }
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className="group flex-1 sm:flex-none rounded-xl transition-all duration-300 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-950/40 hover:scale-105 hover:shadow-sm"
        >
          <Trash2 className="w-4 h-4 sm:mr-2 transition-transform duration-300 group-hover:scale-110" />
          <span className="hidden sm:inline font-medium">Delete</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[440px] rounded-2xl border-2 border-red-100 dark:border-red-900/50 shadow-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 via-transparent to-rose-50/30 dark:from-red-950/20 dark:via-transparent dark:to-rose-950/10 pointer-events-none" />

        <div className="relative">
          <div className="flex justify-center -mt-2 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 dark:bg-red-500/30 blur-xl animate-pulse" />
              <div className="relative bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-900/50 dark:to-rose-900/50 p-4 rounded-2xl border-2 border-red-200 dark:border-red-800">
                <Trash2 className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          <DialogHeader className="space-y-3 text-center">
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-red-600 to-rose-600 dark:from-red-400 dark:to-rose-400 bg-clip-text text-transparent">
              {title || "Delete Item"}
            </DialogTitle>
            <DialogDescription className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
              {description || (
                <>
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-red-600 dark:text-red-400">
                    "{component.componentName}"
                  </span>
                  ? This action cannot be undone.
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-8 flex-col sm:flex-row gap-3">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-xl border-2 transition-all duration-300 hover:bg-gray-50  dark:hover:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-600 hover:scale-105 font-medium dark:hover:text-black"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-full sm:w-auto gap-2 rounded-xl bg-gradient-to-r from-red-600 via-red-600 to-rose-600 hover:from-red-700 hover:via-red-700 hover:to-rose-700 dark:from-red-600 dark:to-rose-600 dark:hover:from-red-700 dark:hover:to-rose-700 shadow-lg hover:shadow-xl hover:shadow-red-500/30 dark:hover:shadow-red-900/50 transition-all duration-300 hover:scale-105 disabled:hover:scale-100 disabled:opacity-60 font-medium"
            >
              <Trash2 className="w-4 h-4" />
              {isDeleting ? "Deleting..." : "Delete Permanently"}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteActions;
