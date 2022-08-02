import React, { useRef } from "react";

const ImageUploader = ({ image, setImage, setPreviewUrl, previewUrl }) => {
  const fileInput = useRef(null);

  const handleOndragOver = (event: any) => {
    event.preventDefault();
  };
  const handleOndrop = (event: any) => {
    //prevent the browser from opening the image
    event.preventDefault();
    event.stopPropagation();
    //let's grab the image file
    let imageFile = event.dataTransfer.files[0];
    handleFile(imageFile);
  };
  const handleFile = (file: Blob | MediaSource) => {
    //you can carry out any file validations here...
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
    console.log("image file", file)
  };
  return (
    <div className="">
      <div
        className=""
        onDragOver={handleOndragOver}
        onDrop={handleOndrop}
        onClick={() => fileInput.current.click()}
      >
        <p>Click to select or Drag and drop image here....</p>
        <input
          type="file"
          accept="image/*"
          ref={fileInput}
          hidden
          onChange={(e) => handleFile(e.target.files[0])}
        />
      </div>
      {previewUrl && (
        <div>
          {/* <img src={previewUrl} alt="image" /> */}
          <span> {image.name} </span>
        </div>
      )}
    </div>
  );
};
export default ImageUploader;