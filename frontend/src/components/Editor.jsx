import React, { useEffect, useRef } from 'react'
import CodeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import { ACTIONS } from '../actions.js'

function Editor({ socketRef, roomId, onCodeChange }) {

  const textareaRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {

    if (editorRef.current) return; 
    editorRef.current = CodeMirror.fromTextArea(textareaRef.current, {
      mode: 'javascript',
      theme: 'dracula',
      autoCloseTags: true,
      autoCloseBrackets: true,
      lineNumbers: true,
    });

    editorRef.current.on('change', (instance, changes) => {
      const { origin } = changes;
      const code = instance.getValue();
        onCodeChange(code);
          if (origin !== 'setValue') {
              socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                  roomId,
                  code,
              });
          }
    });

  }, []);

    useEffect(() => {
        if (socketRef.current) {
          socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
              if (code !== null) {
                editorRef.current.setValue(code);
              }
          });
        }
        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        };
      }, [socketRef.current]);

  return <textarea ref={textareaRef} />;
  
}

export default Editor
