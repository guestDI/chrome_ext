import { useState } from 'react';
import './App.css'

function App() {
  const [title, setTitle] = useState<string>('');
  const [selectedText, setSelectedText] = useState<string>('');
  const getSelection = (title: string) => {

    setTitle(title)
  }

  function getCurrentTab(callback) {
    const queryOptions = { active: true, lastFocusedWindow: true };
    chrome.tabs.query(queryOptions, ([tab]) => {
      if (chrome.runtime.lastError)
      console.error(chrome.runtime.lastError);
      // `tab` will either be a `tabs.Tab` instance or `undefined`.
      callback(tab.title);
    });
  }

  function pasteSelection(callback) {
    chrome.tabs.query({active:true, windowId: chrome.windows.WINDOW_ID_CURRENT}, 
    function(tab) {
      chrome.tabs.sendMessage(tab[0].id || 0, {method: "getSelection"}, 
      function(response){
        callback((response || {}).data);
      });
    });
  }

  return (
    <div className="container">
      <button onClick={() => getCurrentTab(getSelection)}>Get title</button>
      <button onClick={() => pasteSelection(setSelectedText)}>Get selected text</button>
      <p>{title}</p>
      <p>{selectedText}</p>
    </div>
  )
}

export default App
