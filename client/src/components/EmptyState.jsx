export default function EmptyState({
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction,
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-10 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      {Icon && <Icon size={46} className="mx-auto text-[var(--text-muted)] mb-4" />}

      <h2 className="text-xl font-semibold mb-2">{title}</h2>

      <p className="text-sm text-[var(--text-muted)] max-w-md mx-auto">
        {message}
      </p>

      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
