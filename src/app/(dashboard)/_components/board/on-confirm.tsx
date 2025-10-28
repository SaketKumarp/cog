import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogContent,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface useConfirmProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onConfirm: () => void;
  disabled?: boolean;
}

export const ConfirmModal = ({
  children,
  title,
  onConfirm,
  description,
  disabled,
}: useConfirmProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogAction
          disabled={disabled}
          onClick={() => {
            onConfirm();
          }}
        >
          Confirm
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
};
