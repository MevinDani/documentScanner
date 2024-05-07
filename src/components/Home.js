import React, { useCallback, useState } from "react";
import ScanPopupSingleItem from "./ScanPopupSingleItem";
import WebcamCapture from "./WebcamCapture";
import axios from "axios";
import QRScannerComponent from "./QrScanner";


function Home() {

    const [clickedOnTakePicture, setClickedOnTakePicture] = useState(false);

    const [capturedImageState, setCapturedImageState] = useState(null)

    const [callingFileUploadAPI, setIsCallingFileUploadAPI] = useState(false)

    const [showHideScanPopupState, setShowHideScanPopupState] = useState(false);

    const [documentNumber, setDocumentNumber] = useState(null)

    const [scanResult, setScanResult] = useState('');

    const handleScan = result => {
        setScanResult(result);
        setDocumentNumber(result)
    };


    const clickedOnScanButton = () => {

        setShowHideScanPopupState(prev => !prev)

    }

    const clickedOnCloseButton = () => {

        setShowHideScanPopupState(false)

    }

    // const succesFullyScanned = (scannedResult) => {

    //     console.log("success===> ", scannedResult);


    //     if (scannedResult.length > 0) {

    //         console.log("PhysicalStockHome scannedResult ", scannedResult);


    //         setDocumentNumber(scannedResult)

    //     }
    //     else {

    //         console.log("less than 4 character")
    //         setShowHideScanPopupState(prev => !prev)
    //     }
    // }

    const succesFullyScanned = useCallback((scannedResult) => {
        console.log("success===> ", scannedResult);
        clickedOnCloseButton()
        // setDocumentNumber(scannedResult);

        if (scannedResult.length > 0) {
            // clickedOnCloseButton()
            console.log("PhysicalStockHome scannedResult ", scannedResult);
            setDocumentNumber(scannedResult);
        } else {
            console.log("less than 4 characters");
            setShowHideScanPopupState(prev => !prev);
        }
    }, []);


    console.log('documentNumber', documentNumber)

    const imageCaptured = (imageSource_from_capture) => {
        setCapturedImageState(imageSource_from_capture)
        setClickedOnTakePicture(false)
    }

    const callApiToSendImages = async () => {

        setIsCallingFileUploadAPI(true)

        const ticketFormData = new FormData();

        ticketFormData.append("image", await convertABse64ToFile(capturedImageState));

        ticketFormData.append("description", "" + documentNumber);
        ticketFormData.append("UserId", 128);
        ticketFormData.append("imagepath", "C");


        try {
            axios({
                method: "post",
                url: `https://cubixweberp.com:190/Posts`,
                data: ticketFormData,
                headers: { "Content-Type": "multipart/form-data" }
            }).
                then((res) => {

                    setIsCallingFileUploadAPI(false)

                    console.log(" task creation res is ", res);


                    if (res.data != null) {

                        if (res.data.imagepath?.length > 0) {

                            alert("file upload success")
                            setDocumentNumber(null)
                            setCapturedImageState(null)



                        } else {
                            alert("file upload failed, please try later")
                            setDocumentNumber(null)
                            setCapturedImageState(null)


                        }


                    } else {
                        alert("file upload failed, please try later")
                        setDocumentNumber(null)
                        setCapturedImageState(null)


                    }
                }).
                catch((err) => {

                    setIsCallingFileUploadAPI(false)
                    console.log("err is ", err);
                    setDocumentNumber(null)
                    setCapturedImageState(null)

                })
        } catch (error) {
            console.log("error when file upload ==> " + error)

            setDocumentNumber(null)
            setCapturedImageState(null)

            alert("something went wrong , please try later")

        }

    }

    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || "";
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        console.log(byteArrays);

        return new File(byteArrays, "pot.jpg", { type: contentType });
    }

    const convertABse64ToFile = async (base64) => {

        var block = base64.split(";");
        var realData = block[1].split(",")[1];
        var file = b64toBlob(realData, "image/jpg");

        console.log("file ", file)

        return file;

    }

    const takePicture = () => {
        setClickedOnTakePicture(prev => !prev)
    }

    return (
        <div>

            <div className="container">
                <div className="Home-save-container">
                    <div className="d-flex justify-content-end p-4">
                        <button className="btn btn-danger" onClick={() => callApiToSendImages()}>Save</button>
                    </div>
                </div>

                <div >

                    <button className="btn btn-dark" onClick={() => clickedOnScanButton()}>Scan QR code</button>

                    <div className="mt-2">
                        <input className="w-100" placeholder="Document number" value={documentNumber ? documentNumber : ''} />
                    </div>

                </div>

                <div className="Home_camera_container mt-4">
                    <div>
                        <button className="btn btn-warning" onClick={() => takePicture()}>Take picture</button>
                        <img src="" />
                    </div>
                </div>
            </div>

            {
                clickedOnTakePicture != false &&

                <div className="Home-camera-container">
                    <WebcamCapture imageCaptured={imageCaptured} />
                </div>
            }

            {
                clickedOnTakePicture === false &&
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%'
                }}>
                    <img src={capturedImageState} alt="" />

                    {callingFileUploadAPI &&

                        <div className="popup_outer">
                            <div className="popup_inner  ">
                                {

                                }
                                <div className="d-flex flex-column align-items-center mt-4">
                                    <div class="spinner-border" role="status">
                                    </div>
                                    <p className="mt-4">Uploading file, please wait</p>
                                </div>

                            </div>
                        </div>
                    }

                </div>
            }


            {/* {callingFileUploadAPI &&

                <div className="popup_outer">
                    <div className="popup_inner  ">
                        {

                        }
                        <div className="d-flex flex-column align-items-center mt-4">
                            <div class="spinner-border" role="status">
                            </div>
                            <p className="mt-4">Uploading file, please wait</p>
                        </div>

                    </div>
                </div>
            } */}


            {
                showHideScanPopupState &&
                <div className="popup-root-container">
                    {/* <ScanPopupSingleItem succesFullyScanned={succesFullyScanned} clickedOnCloseButton={clickedOnCloseButton} setDocumentNumber={setDocumentNumber} /> */}

                    <QRScannerComponent onScan={handleScan} clickedOnCloseButton={clickedOnCloseButton} setDocumentNumber={setDocumentNumber} />
                </div>
            }

        </div>
    )
}

export default Home;