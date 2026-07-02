export default function Footer() {
  return (
    <footer className="pt-16 pb-10 bg-[var(--primary)] border-t border-[var(--outline)]/20">
      <div className="flex flex-col items-center w-full px-6 max-w-[1280px] mx-auto text-center">
        <span className="font-display text-2xl text-[var(--on-primary)] mb-8">أكاديمية أيمن براهم</span>
        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <a className="text-[var(--on-primary)]/80 hover:text-[var(--tertiary-fixed)] transition-colors font-label text-sm" href="#">سياسة الخصوصية</a>
          <a className="text-[var(--on-primary)]/80 hover:text-[var(--tertiary-fixed)] transition-colors font-label text-sm" href="#">الشروط والأحكام</a>
          <a className="text-[var(--on-primary)]/80 hover:text-[var(--tertiary-fixed)] transition-colors font-label text-sm" href="#">تواصل معنا</a>
        </div>
        <p className="text-[var(--on-primary)]/60 text-sm">
          © {new Date().getFullYear()} أكاديمية أيمن براهم. جميع الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
}