/**
 * @author Evelyn Hong
 * @file TextBox.js
 * @description A React component that provides a text input interface with two tabs:
 *              1. "Paste" tab: Allows users to paste or type text directly.
 *              2. "Upload" tab: Allows users to upload a text file.
 * @module TextBox
 * @version 1.0.0
 * 
 * @requires react
 * @exports TextBox
 */

import { useState } from 'react';
/**
 * A text box component with two tabs:
 * 1/ "Paste" tab displays box that allows users to paste or enter text.
 * 2/ "Upload" tab displays box that allows users to upload text.
 * @returns {JSX.Element} The text box component
 */
export function TextBox({ text, setText }) {
  const [isPasteActive, setIsPasteActive] = useState(true);
  const [isUploadActive, setIsUploadActive] = useState(false);

  // handles event triggered upon clicking the "Paste" tab
  const handlePasteTabClick = () => {
    console.log("Toggled tab: Paste Tab");

    if (!isPasteActive) {
      setIsPasteActive(true);
      setIsUploadActive(false);
    }
  };

  const handleUploadTabClick = () => {
    console.log("Toggled tab: Upload Tab");

    if (!isUploadActive) {
      setIsPasteActive(false);
      setIsUploadActive(true);
    }
  };

  return (
    <div className='text-block-wrapper'>
      <div className='options-wrapper'>
        <button className='button paste-tab' onClick={handlePasteTabClick}>TEXT</button>
        <button className='button upload-tab' onClick={handleUploadTabClick}>UPLOAD</button>
      </div>
      <textarea 
        className={`text-box paste-box ${isPasteActive ? 'active' : ''}`} 
        value={text} 
        onChange={(e) => setText(e.target.value)}
        placeholder='Enter or paste text...'></textarea>
      <input type='file' className={`text-box upload-box ${isUploadActive ? 'active' : ''}`}></input>
    </div>
  );
}
  