import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useCourseStructure } from '../../../hooks/useCourseStructure';
import ContentToolbar from '../../../components/courses/structuredPlayer/ContentToolbar.jsx';


function useSereneScholarshipFonts() {
  useEffect(() => {
    const id = 'serene-scholarship-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Noto+Serif+Arabic:wght@400;600;700&family=Be+Vietnam+Pro:wght@400;500;600&display=swap';
    document.head.appendChild(link);
  }, []);
}

const ICONS = { subcourse: 'menu_book', theme: 'topic', content: 'article' };

const CourseStructureEditor = () => {
  useSereneScholarshipFonts();
  const { courseId } = useParams();
  const {
    subCourses,
    isLoading,
    error,
    addSubCourse,
    editSubCourse,
    removeSubCourse,
    reorderSubCourses,
    addTheme,
    editTheme,
    removeTheme,
    reorderThemes,
    addContentBlock,
    editContentBlock,
    removeContentBlock,
    reorderContentBlocks,
  } = useCourseStructure(courseId, 'admin');

  const textareaRef = useRef(null);
  const [expanded, setExpanded] = useState(new Set());
  const [selected, setSelected] = useState(null); // { type, node, parentId }
  const [form, setForm] = useState({ title: '', body: '' });
  const [saving, setSaving] = useState(false);

  // Drag state: which item is being dragged, and what kind (so we don't drop a theme onto a subcourse list)
  const [dragItem, setDragItem] = useState(null); // { type, id, parentId }
  const [dragOverId, setDragOverId] = useState(null);

  useEffect(() => {
    if (selected) {
      setForm({ title: selected.node.title, body: selected.node.body || '' });
    }
  }, [selected]);

  const toggle = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const select = (type, node, parentId = null) => setSelected({ type, node, parentId });

  const handleAdd = async (type, parentId) => {
    const title = window.prompt(
      type === 'subcourse' ? 'عنوان الوحدة الفرعية' : type === 'theme' ? 'عنوان الموضوع' : 'عنوان المحتوى'
    );
    if (!title) return;
    if (type === 'subcourse') await addSubCourse(title);
    if (type === 'theme') await addTheme(parentId, title);
    if (type === 'content') await addContentBlock(parentId, { title, body: '' });
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm('هل أنت متأكد من الحذف؟ لا يمكن التراجع عن هذا الإجراء.')) return;
    if (type === 'subcourse') await removeSubCourse(id);
    if (type === 'theme') await removeTheme(id);
    if (type === 'content') await removeContentBlock(id);
    if (selected?.node.id === id) setSelected(null);
  };

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      if (selected.type === 'subcourse') await editSubCourse(selected.node.id, { title: form.title });
      if (selected.type === 'theme') await editTheme(selected.node.id, form.title);
      if (selected.type === 'content')
        await editContentBlock(selected.node.id, { title: form.title, body: form.body });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    if (selected?.type !== 'subcourse') return;
    setSaving(true);
    try {
      await editSubCourse(selected.node.id, {
        title: form.title,
        published: !selected.node.published,
      });
      setSelected((s) => ({ ...s, node: { ...s.node, published: !s.node.published } }));
    } finally {
      setSaving(false);
    }
  };

  // ── Drag-and-drop handlers ──
  const handleDragStart = (type, id, parentId) => (e) => {
    setDragItem({ type, id, parentId });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (type, id, parentId) => (e) => {
    e.preventDefault();
    // Only allow dropping within the same type and same parent list
    if (!dragItem || dragItem.type !== type || dragItem.parentId !== parentId) return;
    if (dragOverId !== id) setDragOverId(id);
  };

  const handleDragEnd = () => {
    setDragItem(null);
    setDragOverId(null);
  };

  const handleDrop = (type, siblings, parentId) => async (e) => {
    e.preventDefault();
    if (!dragItem || dragItem.type !== type || dragItem.parentId !== parentId || !dragOverId) {
      setDragItem(null);
      setDragOverId(null);
      return;
    }
    if (dragItem.id === dragOverId) {
      setDragItem(null);
      setDragOverId(null);
      return;
    }

    const ids = siblings.map((s) => s.id);
    const fromIdx = ids.indexOf(dragItem.id);
    const toIdx = ids.indexOf(dragOverId);
    ids.splice(fromIdx, 1);
    ids.splice(toIdx, 0, dragItem.id);

    setDragItem(null);
    setDragOverId(null);

    if (type === 'subcourse') await reorderSubCourses(ids);
    if (type === 'theme') await reorderThemes(parentId, ids);
    if (type === 'content') await reorderContentBlocks(parentId, ids);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] font-[Be_Vietnam_Pro] text-[#414844]">
        جاري التحميل...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh] font-[Be_Vietnam_Pro] text-[#ba1a1a]">
        {error}
      </div>
    );
  }

  const DragHandle = () => (
    <span className="material-symbols-outlined text-[16px] text-[#c1c8c2] cursor-grab active:cursor-grabbing shrink-0">
      drag_indicator
    </span>
  );

  return (
    <div dir="rtl" className="flex h-[calc(100vh-80px)] bg-[#fcf9f8] overflow-hidden">
      {/* Left: edit form */}
      <main className="flex-1 overflow-y-auto p-10">
        {!selected ? (
          <div className="flex flex-col items-center justify-center h-full text-[#717973] font-[Be_Vietnam_Pro]">
            <span className="material-symbols-outlined text-5xl mb-3 opacity-40">
              touch_app
            </span>
            اختر عنصرًا من القائمة على اليمين للتعديل
          </div>
        ) : (
          <div className="max-w-2xl">
            <div className="flex items-center justify-between mb-8">
              <span className="inline-block bg-[#f6f3f2] text-[#414844] text-xs font-[Inter] font-semibold px-3 py-1 rounded">
                {selected.type === 'subcourse' ? 'وحدة فرعية' : selected.type === 'theme' ? 'موضوع' : 'محتوى'}
              </span>
              {selected.type === 'subcourse' && (
                <button
                  onClick={handleTogglePublish}
                  disabled={saving}
                  className={`flex items-center gap-2 px-4 py-2 rounded font-[Inter] text-sm font-semibold transition-all ${
                    selected.node.published
                      ? 'bg-[#c1ecd4]/40 text-[#012d1d]'
                      : 'bg-[#f6f3f2] text-[#717973]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {selected.node.published ? 'visibility' : 'visibility_off'}
                  </span>
                  {selected.node.published ? 'منشور' : 'مسودة'}
                </button>
              )}
            </div>

            <label className="block font-[Inter] text-xs font-semibold text-[#717973] mb-2">
              العنوان
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full font-[Noto_Serif_Arabic] text-2xl font-semibold text-[#012d1d] border-b-2 border-[#c1c8c2] focus:border-[#e9c176] outline-none pb-3 mb-8 bg-transparent"
            />

            {selected.type === 'content' && (
              <>
                <label className="block font-[Inter] text-xs font-semibold text-[#717973] mb-2">
                  المحتوى
                </label>
                <ContentToolbar
                  textareaRef={textareaRef}
                  value={form.body}
                  onChange={(newBody) => setForm((f) => ({ ...f, body: newBody }))}
                />
                <textarea
                  ref={textareaRef}
                  rows={14}
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  className="w-full font-[Be_Vietnam_Pro] text-base leading-[1.8] text-[#1b1c1c] border border-[#c1c8c2] focus:border-[#e9c176] rounded-b-lg p-4 outline-none resize-none mb-8"
                  placeholder={'# عنوان رئيسي\nنص عادي هنا...\n## عنوان فرعي\n**كلمة عريضة** و *كلمة مائلة*\n- عنصر قائمة\n- عنصر آخر'}
                />
              </>
            )}

            <button
              onClick={handleSave}
              disabled={saving || !form.title}
              className="bg-[#012d1d] text-white font-[Inter] font-semibold text-sm px-6 py-3 rounded hover:opacity-90 transition-all disabled:opacity-50"
            >
              {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
            </button>
          </div>
        )}
      </main>

      {/* Right: tree */}
      <aside className="w-96 shrink-0 h-full bg-[#f6f3f2] border-l border-[#c1c8c2]/30 overflow-y-auto flex flex-col">
        <div className="p-5 border-b border-[#c1c8c2]/30">
          <h3 className="font-[Noto_Serif_Arabic] text-xl font-semibold text-[#012d1d]">
            هيكل المنهج
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {subCourses.map((sc) => {
            const isExpanded = expanded.has(sc.id);
            const isSelected = selected?.node.id === sc.id;
            const isDragOver = dragOverId === sc.id && dragItem?.type === 'subcourse';
            return (
              <div key={sc.id}>
                <div
                  draggable
                  onDragStart={handleDragStart('subcourse', sc.id, null)}
                  onDragOver={handleDragOver('subcourse', sc.id, null)}
                  onDrop={handleDrop('subcourse', subCourses, null)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-2 px-4 py-2.5 cursor-pointer transition-all border-t-2 ${
                    isDragOver ? 'border-t-[#e9c176]' : 'border-t-transparent'
                  } ${isSelected ? 'bg-[#c1ecd4]/30' : 'hover:bg-white/50'}`}
                >
                  <DragHandle />
                  <button onClick={() => toggle(sc.id)} className="text-[#414844]">
                    <span className="material-symbols-outlined text-[18px]">
                      {isExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_left'}
                    </span>
                  </button>
                  <span className="material-symbols-outlined text-[16px] text-[#5d4201]">
                    {ICONS.subcourse}
                  </span>
                  <span
                    onClick={() => select('subcourse', sc)}
                    className={`flex-1 font-[Inter] text-sm truncate ${
                      !sc.published ? 'text-[#717973] italic' : 'text-[#1b1c1c] font-semibold'
                    }`}
                  >
                    {sc.title}
                  </span>
                  <button onClick={() => handleDelete('subcourse', sc.id)} className="text-[#717973] hover:text-[#ba1a1a]">
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                </div>

                {isExpanded && (
                  <div>
                    {sc.themes.map((theme) => {
                      const themeExpanded = expanded.has(theme.id);
                      const themeSelected = selected?.node.id === theme.id;
                      const isThemeDragOver = dragOverId === theme.id && dragItem?.type === 'theme';
                      return (
                        <div key={theme.id}>
                          <div
                            draggable
                            onDragStart={handleDragStart('theme', theme.id, sc.id)}
                            onDragOver={handleDragOver('theme', theme.id, sc.id)}
                            onDrop={handleDrop('theme', sc.themes, sc.id)}
                            onDragEnd={handleDragEnd}
                            className={`flex items-center gap-2 pr-6 pl-4 py-2 cursor-pointer transition-all border-t-2 ${
                              isThemeDragOver ? 'border-t-[#e9c176]' : 'border-t-transparent'
                            } ${themeSelected ? 'bg-[#c1ecd4]/30' : 'hover:bg-white/50'}`}
                          >
                            <DragHandle />
                            <button onClick={() => toggle(theme.id)} className="text-[#414844]">
                              <span className="material-symbols-outlined text-[16px]">
                                {themeExpanded ? 'keyboard_arrow_down' : 'keyboard_arrow_left'}
                              </span>
                            </button>
                            <span className="material-symbols-outlined text-[14px] text-[#414844]">
                              {ICONS.theme}
                            </span>
                            <span
                              onClick={() => select('theme', theme, sc.id)}
                              className="flex-1 font-[Inter] text-sm text-[#1b1c1c] truncate"
                            >
                              {theme.title}
                            </span>
                            <button onClick={() => handleDelete('theme', theme.id)} className="text-[#717973] hover:text-[#ba1a1a]">
                              <span className="material-symbols-outlined text-[14px]">delete</span>
                            </button>
                          </div>

                          {themeExpanded && (
                            <div>
                              {theme.contents.map((content) => {
                                const contentSelected = selected?.node.id === content.id;
                                const isContentDragOver = dragOverId === content.id && dragItem?.type === 'content';
                                return (
                                  <div
                                    key={content.id}
                                    draggable
                                    onDragStart={handleDragStart('content', content.id, theme.id)}
                                    onDragOver={handleDragOver('content', content.id, theme.id)}
                                    onDrop={handleDrop('content', theme.contents, theme.id)}
                                    onDragEnd={handleDragEnd}
                                    onClick={() => select('content', content, theme.id)}
                                    className={`flex items-center gap-2 pr-12 pl-4 py-2 cursor-pointer transition-all border-t-2 ${
                                      isContentDragOver ? 'border-t-[#e9c176]' : 'border-t-transparent'
                                    } ${contentSelected ? 'bg-[#c1ecd4]/30' : 'hover:bg-white/50'}`}
                                  >
                                    <DragHandle />
                                    <span className="material-symbols-outlined text-[13px] text-[#717973]">
                                      {ICONS.content}
                                    </span>
                                    <span className="flex-1 font-[Inter] text-xs text-[#414844] truncate">
                                      {content.title}
                                    </span>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleDelete('content', content.id); }}
                                      className="text-[#717973] hover:text-[#ba1a1a]"
                                    >
                                      <span className="material-symbols-outlined text-[13px]">delete</span>
                                    </button>
                                  </div>
                                );
                              })}
                              <button
                                onClick={() => handleAdd('content', theme.id)}
                                className="w-full text-right pr-12 pl-4 py-2 text-[#5d4201] hover:bg-white/50 font-[Inter] text-xs font-semibold flex items-center gap-2"
                              >
                                <span className="material-symbols-outlined text-[14px]">add</span>
                                إضافة محتوى
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <button
                      onClick={() => handleAdd('theme', sc.id)}
                      className="w-full text-right pr-6 pl-4 py-2 text-[#5d4201] hover:bg-white/50 font-[Inter] text-xs font-semibold flex items-center gap-2"
                    >
                      <span className="material-symbols-outlined text-[16px]">add</span>
                      إضافة موضوع
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-[#c1c8c2]/30">
          <button
            onClick={() => handleAdd('subcourse', null)}
            className="w-full border-2 border-dashed border-[#c1c8c2] hover:border-[#e9c176] text-[#414844] hover:text-[#5d4201] font-[Inter] text-sm font-semibold py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            إضافة وحدة فرعية جديدة
          </button>
        </div>
      </aside>
    </div>
  );
};

export default CourseStructureEditor;