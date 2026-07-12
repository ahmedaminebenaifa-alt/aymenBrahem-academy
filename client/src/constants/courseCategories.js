export const COURSE_CATEGORIES = {
  QURAN:   { label: 'القرآن الكريم', id: 'QURAN' },
  TAFSIR:  { label: 'التفسير',       id: 'TAFSIR' },
  FIQH:    { label: 'الفقه',          id: 'FIQH' },
  AQEEDAH: { label: 'العقيدة',        id: 'AQEEDAH' },
  ARABIC:  { label: 'اللغة العربية',  id: 'ARABIC' },
  HADITH:  { label: 'الحديث',         id: 'HADITH' },
};

export const CATEGORY_FILTERS = [
  { id: 'all', label: 'الكل' },
  ...Object.values(COURSE_CATEGORIES),
];

export const getCategoryLabel = (categoryKey) =>
  COURSE_CATEGORIES[categoryKey]?.label || null;