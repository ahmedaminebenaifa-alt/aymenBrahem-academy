const SHEIKH_EMAIL = 'sheikh@example.com'; // ← replace with the real address

export default function SupportButton({ userName = '', userEmail = '' }) {
  const subject = encodeURIComponent('طلب مساعدة - أكاديمية أيمن ابراهيم');
  const body = encodeURIComponent(
    `السلام عليكم ورحمة الله وبركاته،\n\n` +
    `الاسم: ${userName || ''}\n` +
    `البريد الإلكتروني: ${userEmail || ''}\n\n` +
    `أحتاج مساعدة بخصوص:\n\n`
  );

  const mailtoUrl = `mailto:${SHEIKH_EMAIL}?subject=${subject}&body=${body}`;

  return (
    <a
      href={mailtoUrl}
      className="w-full py-2.5 px-3 bg-[var(--surface-container-high)] hover:bg-[var(--surface-container-highest)] text-[var(--on-surface-variant)] hover:text-[var(--primary)] text-xs font-bold rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
    >
      <span className="material-symbols-outlined text-base">help</span>
      طلب مساعدة الدعم
    </a>
  );
}