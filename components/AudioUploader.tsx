import React, { useRef } from "react";

const AudioUploader = ({ audio, setAudio }) => {
  const audioInput = useRef(null);

  const handleOndragOver = (event: any) => {
    event.preventDefault();
  };
  const handleOndrop = (event: any) => {
    //prevent the browser from opening the image
    event.preventDefault();
    event.stopPropagation();
    //let's grab the image file
    let audio = event.dataTransfer.files[0];
    handleAudio(audio);
  };
  const handleAudio = (file: File) => {
    //you can carry out any file validations here...
    setAudio(file);
    console.log("audio file", file)
  };
  return (
    <div className="">
      <div
        className=""
        onDragOver={handleOndragOver}
        onDrop={handleOndrop}
        onClick={() => audioInput.current.click()}
      >
        <p>Click to select or Drag and drop your song here....</p>
        <input
          type="file"
          accept="audio/*"
          ref={audioInput}
          hidden
          onChange={(e) => handleAudio(e.target.files[0])}
        />
      </div>
      {audio && (
        <div>
          <span> {audio.name} </span>
        </div>
      )}
    </div>
  );
};
export default AudioUploader;