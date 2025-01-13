/**
 * @file AudioPlayer.js
 * @description A React component for rendering a customizable audio player.
 *              Features include play/pause functionality, a dynamic seek bar,
 *              and real-time duration and current time display.
 *              Includes helper functions:
 *              - getAudio(): Fetches audio data for playback.
 *              - formatMinSec(): Converts seconds into MM:SS format.
 * @module AudioPlayer
 * @version 1.0.0
 * 
 * @requires react
 * @requires react-dom
 * @exports AudioPlayer
 */

import { useState, useRef, useEffect } from 'react';
import ScaleLoader from "react-spinners/ScaleLoader";
// import Alert from './Alert';

/**
 * Fetches audio data for playback.
 * @param {string} text 
 * @returns An audio url reading the inputted text
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
 * Converts seconds into MM:SS format for display.
 * @param {float} secs 
 * @returns {string} The input seconds formatted in MM:SS
 */
function formatMinSec(secs) {
    const mins = secs / 60;
    const remSecs = secs % 60;

    return `${Math.floor(mins)}:${remSecs < 10 ? "0" : ""}${Math.floor(secs)}`;
}

/**
 * 
 * @param {props} text
 * @returns An audio player
 */
export function AudioPlayer({ text }) {
    const [isGenerateClicked, setIsGenerateClicked] = useState(false);
    const [isPlayClicked, setIsPlayClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [audioUrl, setAudioUrl] = useState('');
    const [audioDuration, setAudioDuration] = useState(null);
    const [progress, setProgress] = useState(0);
    const audioRef = useRef();
    const previousTextRef = useRef('');
    
    useEffect(() => {
        const audio = audioRef.current;

        const updateProgress = () => {
            if (audio && audio.duration) {
                const currentProgress = (audio.currentTime / audio.duration) * 100;
                setProgress(currentProgress);
            }
        }

        audio.addEventListener("timeupdate", updateProgress);

        return () => {
            audio.removeEventListener("timeupdate", updateProgress);
        };
    }, []);

    const handleGenerateClick = async () => {
        if (text === previousTextRef.current) {
            alert("The audio has been generated for this text.");
            return;
        }

        console.log("Text from TextBox: ", text);
        setIsGenerateClicked(false);
        setIsLoading(true);

        try {
            const url = await getAudio(text);
            setAudioUrl(url);
            console.log('Successfully generated audio');
        } catch (error) {
            console.error('Failed to generate audio', error);
            return;
        }

        setIsGenerateClicked(false);
        setIsLoading(false);
        
        setTimeout(() => {
            setIsGenerateClicked(true);
            setProgress(0);
        }, 10);

        console.log("Audio duration:", audioRef.current.duration);
        setAudioDuration(audioRef.current.duration);

        previousTextRef.current = text;
    };

    const handlePlayClick = () => {
        if (audioRef.current) {
            /** Controls the play button UI */
            if (audioRef.current.paused) {
                audioRef.current.play()
                    .then(() => {
                        console.log('Audio is playing');
                        setIsPlayClicked(true);
                    })
                    .catch((error) => {
                        console.error('Error during play:', error);
                    });
            } else {
                audioRef.current.pause();
                console.log('Audio is paused');
                setIsPlayClicked(false);
            }
        }

        /** Sets the play button to "paused" form when finished playback */
        audioRef.current.onended = () => {
            console.log("Playback finished.");
            setIsPlayClicked(false);
        };
    }

    /** Syncs the progress time with user-selected time */
    const handleSeek = (e) => {
        const audio = audioRef.current;
        const newTime = (e.target.value / 100) * audioDuration;
        audio.currentTime = newTime;
        setProgress(e.target.value);
    }
      
    return (
        <div className="audio-player-wrapper">
          <div className={`custom-audio-player ${isGenerateClicked ? 'show' : ''}`}>
            <button className={`play-button ${isPlayClicked ? 'playing' : ''}`} onClick={handlePlayClick}></button>
            <input type="range" id="seekBar" min="0" max="100" value={progress} onChange={handleSeek} style={{'--progress': `${progress}%`,}}></input>
            <span id="currentTime">{formatMinSec(audioRef.current?.currentTime || 0)}</span>
          </div>
          {/* <p className={`alert ${}`}> * The audio has been generated for this text * </p> */}
          <button className={`button generate-button ${isGenerateClicked ? 'move' : ''}`} onClick={handleGenerateClick} disabled={isLoading}
          >
            {isLoading? (
                <>
                    <ScaleLoader 
                    height={15}
                    color={"#fff6eb"}
                    />
                </>
            ) : ("GENERATE")}</button>
          <audio ref={audioRef} src={audioUrl}></audio>
        </div>
    );
  }