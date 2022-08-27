import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import "react-h5-audio-player/lib/styles.css";
import { useContext, useState, useEffect } from "react";

import { useRef } from "react";

export const CustomAudioPlayer = (musicSRC) => {

    return (
        <div className="w-full flex flex-row justify-center">
            <AudioPlayer        
                volume={0.5}
                autoPlay={false}
                src={musicSRC.musicSRC}
                showJumpControls={false}
                showDownloadProgress={false}
                customControlsSection={[]}
                customProgressBarSection={[
                    RHAP_UI.MAIN_CONTROLS,
                    RHAP_UI.CURRENT_TIME,
                    <div key={musicSRC} className='mx-1'>
                        {" / "}
                    </div>,
                    RHAP_UI.DURATION,
                    RHAP_UI.PROGRESS_BAR,
                    RHAP_UI.VOLUME,
                ]}
                customAdditionalControls={[]}
            />
        </div>
    );
};