import { useState } from 'react';
import logo from './assets/TextToAudioLogo.svg'


/**
 * A text box component with two tabs:
 * 1/ "Paste" tab displays box that allows users to paste or enter text.
 * 2/ "Upload" tab displays box that allows users to upload text.
 * @returns {JSX.Element} The text box component
 */
function TextBox() {
  const [isPasteActive, setIsPasteActive] = useState(true);
  const [isUploadActive, setIsUploadActive] = useState(false);

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
        <button className='button paste-tab' onClick={handlePasteTabClick}>PASTE</button>
        <button className='button upload-tab' onClick={handleUploadTabClick}>UPLOAD</button>
      </div>
      <textarea className={`text-box paste-text ${isPasteActive ? 'active' : ''}`} placeholder='Enter or paste text...'></textarea>
      <input type='file' className={`text-box upload-text ${isUploadActive ? 'active' : ''}`}></input>
    </div>
  );
}


export default function Main() {
    function handleGenerateClick() {
    alert('Generate something');
  }

  return (
    <>
      <nav className="top-bar">
        <div className='logo-wrapper'>
          <a>
            <img src={logo} id='logo-img' ></img>
            <span className='logo-text'>TEXT TO AUDIO</span>
          </a>
        </div>
      </nav>
      <div className="work-area-container">
        <div className='description-player-wrapper'>
          <h1 id='header'>Let us <span id='read-header'>read</span> to you...</h1>
          <p id='paragraph'>
            Paste text or upload a document of a story; 
            click the "generate" button and patiently wait for our storyteller.
          </p>
          <div className='divider'></div>
          <button className='button generate-button' onClick={handleGenerateClick}>GENERATE</button>
        </div>
        <TextBox />
      </div>
    </>
  );
}

