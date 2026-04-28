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

export default function DeleteDialog({ open, onConfirm, onCancel }) {
  return (
    <AlertDialog open={open} onOpenChange={onCancel}>
      <AlertDialogContent className="bg-zinc-900 border-zinc-800">
        <AlertDialogHeader className="bg-zinc-900">
          <AlertDialogTitle className="text-zinc-100">
            Excluir transação?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-zinc-400">
            Essa ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="bg-zinc-900">
          <AlertDialogCancel
            onClick={onCancel}
            className="cursor-pointer bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="cursor-pointer bg-red-600 text-white hover:bg-red-700 border-0"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
