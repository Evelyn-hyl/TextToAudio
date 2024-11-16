import { useState, useRef } from 'react';

/**
 * a function that generates an audio from text
 * fetches audio from server
 * @param {string} text 
 * @returns an audio url reading the inputted text
 */
async function getAudio(text) {
    const url = "http://localhost:5000/api/generate-audio";

    const options = {
        method: "POST",
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json',},
        body: JSON.stringify({
            text: text,
            voice: "s3://voice-cloning-zero-shot/4c627545-b9c0-4791-ae8e-f48f5475247c/bryansaad/manifest.json",
            quality: "draft",
            output_format: "mp3",
            speed: 1,
            sample_rate: 24000,
            seed: null,
            temperature: null,
            voice_engine: "PlayHT2.0",
            voice_guidance: 5,
            style_guidance: 20
        }),
    };
    
    const res = await fetch(url, options);

    if (!res.ok) {
        throw new Error('HTTP error: Error generating audio');
    }
    
    const data = await res.json();
    console.log('URL to fetch audio: ', data.audioUrl)
    return data.audioUrl;
}

/**
 * 
 * @param {float} secs 
 * @returns the input seconds formatted in MM:SS
 */
function formatMinSecs(secs) {
    const mins = secs / 60;
    const remSecs = secs % 60;

    return `${Math.floor(mins)}:${remSecs < 10 ? "0" : ""}${Math.floor(secs)}`;
}

/**
 * 
 * @param {props} text
 * @returns an audio player
 */
export function AudioPlayer({ text }) {
    const [isGenerateClick, setIsGenerateClick] = useState(false);
    const [isPlayClick, setIsPlayClick] = useState(false);
    const [audioUrl, setAudioUrl] = useState('');
    const [audioDuration, setAudioDuration] = useState(null);
    const audioRef = useRef();
    const minSecs = formatMinSecs(audioDuration);
    
    const handleGenerateClick = async () => {
        console.log("Text from TextBox: ", text);

        try {
            const url = await getAudio(text);
            setAudioUrl(url);
            console.log('Successfully generated audio');
        } catch (error) {
            console.error('Failed to generate audio', error);
            return;
        }

        setIsGenerateClick(false);
        setTimeout(() => {
            setIsGenerateClick(true);
        }, 10);
    };

    const handlePlayClick = () => {
        if (audioRef.current) {
            console.log("Audio duration:", audioRef.current.duration);
            setAudioDuration(audioRef.current.duration);

            if (audioRef.current.paused) {
                audioRef.current.play()
                    .then(() => {
                        console.log('Audio is playing');
                        setIsPlayClick(true);
                    })
                    .catch((error) => {
                        console.error('Error during play:', error);
                    });
            } else {
                audioRef.current.pause();
                console.log('Audio is paused');
                setIsPlayClick(false);
            }
        }

        if (isPlayClick == false) {
            setIsPlayClick(true);
        } else {
            setIsPlayClick(false);
        }
    }
  
    return (
        <div className="audio-player-wrapper">
          <div className={`custom-audio-player ${isGenerateClick ? 'show' : ''}`}>
            <button className={`play-button ${isPlayClick ? 'playing' : ''}`} onClick={handlePlayClick}></button>
            <input type="range" id="seekBar" min="0" max="100" defaultValue="0"></input>
            <span id="currentTime">{minSecs}</span>
          </div>
          <button className={`button generate-button ${isGenerateClick ? 'move' : ''}`} onClick={handleGenerateClick}>GENERATE</button>
          <audio ref={audioRef} src={audioUrl}></audio>
        </div>
    );
  }