import { useState, useEffect, useMemo, useCallback } from 'react';

const KEY_PREFIX = 'course-position:';

export function useReadingPosition(courseId, subCourses) {
  // Flatten SubCourse -> Theme -> Content into one ordered list, like Odin's lesson sequence
  const flatLessons = useMemo(() => {
    const flat = [];
    subCourses.forEach((sc) => {
      sc.themes.forEach((theme) => {
        theme.contents.forEach((content) => {
          flat.push({
            subCourseId: sc.id,
            subCourseTitle: sc.title,
            themeId: theme.id,
            themeTitle: theme.title,
            content,
          });
        });
      });
    });
    return flat;
  }, [subCourses]);

  const [activeContentId, setActiveContentId] = useState(null);
  const [expanded, setExpanded] = useState(new Set());
  const [hasRestored, setHasRestored] = useState(false);

  // Restore saved position (by content id) once lessons are loaded
  useEffect(() => {
    if (flatLessons.length === 0 || hasRestored) return;

    let savedId = null;
    try {
      savedId = localStorage.getItem(`${KEY_PREFIX}${courseId}`);
    } catch {
      savedId = null;
    }

    const savedLesson = savedId && flatLessons.find((l) => l.content.id === savedId);
    const initial = savedLesson || flatLessons[0];

    setActiveContentId(initial.content.id);
    setExpanded(new Set([initial.subCourseId]));
    setHasRestored(true);
  }, [flatLessons, hasRestored, courseId]);

  useEffect(() => {
    if (!hasRestored || !activeContentId) return;
    try {
      localStorage.setItem(`${KEY_PREFIX}${courseId}`, activeContentId);
    } catch {
      // non-critical — position just won't persist
    }
  }, [activeContentId, courseId, hasRestored]);

  const activeIndex = flatLessons.findIndex((l) => l.content.id === activeContentId);
  const activeLesson = activeIndex >= 0 ? flatLessons[activeIndex] : null;

  const toggleSubCourse = (id) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const goToLesson = useCallback(
    (contentId) => {
      const lesson = flatLessons.find((l) => l.content.id === contentId);
      if (!lesson) return;
      setActiveContentId(contentId);
      setExpanded((prev) => new Set(prev).add(lesson.subCourseId));
    },
    [flatLessons]
  );

  // Sidebar theme click -> jump to that theme's first content block
  const selectTheme = useCallback(
    (subCourseId, themeId) => {
      const lesson = flatLessons.find((l) => l.subCourseId === subCourseId && l.themeId === themeId);
      if (lesson) goToLesson(lesson.content.id);
    },
    [flatLessons, goToLesson]
  );

  const goNext = useCallback(() => {
    if (activeIndex < flatLessons.length - 1) goToLesson(flatLessons[activeIndex + 1].content.id);
  }, [activeIndex, flatLessons, goToLesson]);

  const goPrev = useCallback(() => {
    if (activeIndex > 0) goToLesson(flatLessons[activeIndex - 1].content.id);
  }, [activeIndex, flatLessons, goToLesson]);

  const hasPrev = activeIndex > 0;
  const hasNext = activeIndex >= 0 && activeIndex < flatLessons.length - 1;

  return {
    flatLessons,
    activeLesson,
    activeContentId,
    expanded,
    toggleSubCourse,
    selectTheme,
    goToLesson,
    goNext,
    goPrev,
    hasPrev,
    hasNext,
  };
}