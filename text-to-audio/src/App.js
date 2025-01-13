import { useState } from 'react';
import logo from './assets/TextToAudioLogo.svg'
import { TextBox } from './components/TextBox';
import { AudioPlayer } from './components/AudioPlayer';
// import { generateAudio } from './api/api.js';


export default function Main() {
  const [text, setText] = useState('');

  // const handleGenerateAudio = async () => {
  //   const audioUrl = await generateAudio(text);
  // }

  return (
    <>
      <nav className="top-bar">
        <div className='logo-wrapper'>
          <a>
            <img src={logo} id='logo-img' alt='Text to Audio'></img>
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
          <AudioPlayer text={text}/>
        </div>
        <TextBox text={text} setText={setText} />
      </div>
    </>
  );
}
