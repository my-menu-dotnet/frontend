import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Button from "./Button";

type DeleteConfirmationProps = {
  /** Controlled open state. */
  isOpen?: boolean;
  /** shadcn-style alias for `isOpen`. */
  open?: boolean;
  /** Called when the dialog should close (backdrop click, Esc, cancel). */
  onClose?: () => void;
  /** shadcn-style alias for `onClose`. */
  onOpenChange?: (open: boolean) => void;
  /** Body copy / markup rendered below the title. */
  body?: React.ReactNode;
  /** Header copy / markup rendered as the dialog title. */
  header?: React.ReactNode;
  /** Confirm action handler. */
  onConfirm?: () => void;
  /** Text for the confirm button (defaults to "Enviar"). */
  confirmText?: string;
  /** Text for the cancel button (defaults to "Cancelar"). */
  cancelText?: string;
};

/**
 * Wraps the shadcn AlertDialog for destructive confirmations. Keeps the
 * Hero-UI `isOpen` / `onClose` signature so existing call sites work, but
 * also accepts the shadcn `open` / `onOpenChange` for new code.
 */
export default function DeleteConfirmation({
  isOpen,
  open,
  onClose,
  onOpenChange,
  body,
  header,
  onConfirm,
  confirmText = "Enviar",
  cancelText = "Cancelar",
}: DeleteConfirmationProps) {
  const controlledOpen = isOpen ?? open ?? false;

  const handleOpenChange = (next: boolean) => {
    onOpenChange?.(next);
    if (!next) onClose?.();
  };

  return (
    <AlertDialog open={controlledOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          {header && <AlertDialogTitle>{header}</AlertDialogTitle>}
          {body && (
            <AlertDialogDescription>{body}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onClose}>
              {cancelText}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              data-test="button-modal-delete"
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
