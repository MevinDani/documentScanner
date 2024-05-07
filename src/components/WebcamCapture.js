import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";


const WebcamCapture = (props) => {

  const { imageCaptured } = props;

  const [widthOfVideo, setWidthOfVideo] = useState(300)
  const [heightOfVideo, setHeightOfVideo] = useState(300)

  const webcamRef = React.useRef(null);


  useEffect(() => {

    const isMobile = window.matchMedia('(max-width: 575.98px)');

    const isTablet = window.matchMedia('(min-width: 576px)', '(max-width: 767.98px)');

    if (isMobile.matches) {
      setWidthOfVideo(300)
    }

    if (isTablet.matches) {
      setWidthOfVideo(300)
    }

  }, [])

  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();



      imageCaptured(imageSrc)

    },
    [webcamRef]
  );

  const videoConstraints = {
    width: widthOfVideo,
    height: heightOfVideo,
    facingMode: "environment"
  };




  return (
    <>

      <div className="AdminScanPage-root-container">

        <div className="Home-inner-container">

          <div className="Home-header-container container p-2">

          </div>

          <div className="QrScannerWrapper mx-auto" style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}>

            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
            />

          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%'
          }}>

            <button className="btn btn-warning mt-4" onClick={capture}>Capture photo</button>
          </div>

        </div>

      </div>
    </>
  );
};

export default WebcamCapture;