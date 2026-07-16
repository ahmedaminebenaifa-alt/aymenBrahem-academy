// Wraps or prefixes the current textarea selection with markdown syntax, then restores focus + cursor.
function applyWrap(textareaRef, before, after, value, onChange) {
  const el = textareaRef.current;
  if (!el) return;
  const start = el.selectionStart;
  const end = el.selectionEnd;
  const selected = value.slice(start, end) || 'نص';
  const newValue = value.slice(0, start) + before + selected + after + value.slice(end);
  onChange(newValue);

  requestAnimationFrame(() => {
    el.focus();
    el.selectionStart = start + before.length;
    el.selectionEnd = start + before.length + selected.length;
  });
}

function applyLinePrefix(textareaRef, prefix, value, onChange) {
  const el = textareaRef.current;
  if (!el) return;
  const start = el.selectionStart;
  // Find the start of the current line
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  const newValue = value.slice(0, lineStart) + prefix + value.slice(lineStart);
  onChange(newValue);

  requestAnimationFrame(() => {
    el.focus();
    el.selectionStart = el.selectionEnd = start + prefix.length;
  });
}

export default function ContentToolbar({ textareaRef, value, onChange }) {
  const buttons = [
    {
      icon: 'format_bold',
      label: 'عريض',
      onClick: () => applyWrap(textareaRef, '**', '**', value, onChange),
    },
    {
      icon: 'format_italic',
      label: 'مائل',
      onClick: () => applyWrap(textareaRef, '*', '*', value, onChange),
    },
    {
      icon: 'link',
      label: 'رابط',
      onClick: () => {
        const url = window.prompt('أدخل الرابط:');
        if (!url) return;
        applyWrap(textareaRef, '[', `](${url})`, value, onChange);
      },
    },
    {
      icon: 'format_list_bulleted',
      label: 'قائمة',
      onClick: () => applyLinePrefix(textareaRef, '- ', value, onChange),
    },
  ];

  return (
    <div className="flex items-center gap-1 bg-[#f6f3f2] px-3 py-2 border border-[#c1c8c2] border-b-0 rounded-t-lg">
      {buttons.map((btn) => (
        <button
          key={btn.icon}
          type="button"
          onClick={btn.onClick}
          title={btn.label}
          className="p-1.5 rounded text-[#414844] hover:bg-white hover:text-[#012d1d] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">{btn.icon}</span>
        </button>
      ))}
      <div className="w-px h-4 bg-[#c1c8c2] mx-1" />
      <span className="text-[11px] text-[#717973] font-[Inter]">
        # عنوان، ## عنوان فرعي، ### نقطة، **عريض**، *مائل*، - قائمة
      </span>
    </div>
  );
}