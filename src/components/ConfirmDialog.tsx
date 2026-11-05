import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface Props {
  habitTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ habitTitle, onConfirm, onCancel }: Props) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-ink-950/80 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-sm rounded-2xl border border-ink-700 bg-ink-900 shadow-2xl shadow-black/50 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5">
          <div className="w-12 h-12 rounded-xl bg-rose-500/15 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-rose-400" />
          </div>
          <h2 className="font-bold text-lg mb-1">Удалить привычку?</h2>
          <p className="text-sm text-zinc-400">
            «{habitTitle}» будет удалена без возможности восстановления.
          </p>
        </div>
        <div className="px-6 py-4 border-t border-ink-700 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-rose-500 text-white hover:bg-rose-400 transition-all shadow-lg shadow-rose-500/20"
          >
            Удалить
          </button>
        </div>
      </motion.div>
    </div>
  );
}
