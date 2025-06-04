import { useEffect, useRef } from 'react';
import { EditorView, keymap } from '@codemirror/view';
import { basicSetup } from 'codemirror';
import { sql } from '@codemirror/lang-sql';
import { EditorState } from '@codemirror/state';
import { useSqlStore } from '../store/sqlStore';
import { oneDark } from '@codemirror/theme-one-dark';
import { githubLight } from '@uiw/codemirror-theme-github';
import { useTheme } from '../hooks/useTheme';

export default function SqlEditor() {
  const { currentQuery, setCurrentQuery, executeQuery } = useSqlStore();
  const { theme } = useTheme();
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      const updateListener = EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const text = update.state.doc.toString();
          setCurrentQuery(text);
        }
      });

      const startState = EditorState.create({
        doc: currentQuery,
        extensions: [
          basicSetup,
          sql(),
          updateListener,
          keymap.of([
            {
              key: 'Ctrl-Enter',
              run: () => {
                executeQuery();
                return true;
              },
            },
          ]),
          theme === 'dark' ? oneDark : githubLight,
        ],
      });

      viewRef.current = new EditorView({
        state: startState,
        parent: editorRef.current,
      });
    }
  }, [currentQuery, executeQuery, setCurrentQuery, theme]);

  return (
    <div className="sql-editor p-4 border rounded bg-white dark:bg-gray-800 shadow-sm">
      <div ref={editorRef} className="min-h-[12rem] max-h-[24rem] overflow-auto" />
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Press Ctrl+Enter to run
      </p>
    </div>
  );
}
