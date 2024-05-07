import React, { useEffect, useState, useRef, useCallback } from "react";
import { Scanner } from '@yudiel/react-qr-scanner';
import "../css/ScanPopup.css";

import { QrReader } from 'react-qr-reader';

function ScanPopupSingleItem(props) {

    const [data, setData] = useState(null);

    const ref = useRef(null);

    const [delayScan, setDelayScan] = useState(500);

    // const scannerPausedRef = useRef(false)

    // const scannerRef = useRef(null);

    const { succesFullyScanned, clickedOnCloseButton, setDocumentNumber } = props
    const rootLayoutRef = useRef();

    // when qr code is scanned result comes here 
    // if there is any change in value setShowScannedDetailsPopup is called
    // till API call response even if user shows same qr code multiple times
    // no problem because no change of state 
    // After API result popup is closed

    let releaseScannerTimer = null;

    const releaseScanner = () => {
        releaseScannerTimer = setTimeout(() => {
            console.log("inside setTimeout ofrelaseScanner")
            // scannerPausedRef.current = false;
        }, 5000)
    }

    const closeCam = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true,
        });
        stream.getTracks().forEach(function (track) {
            track.stop();
            track.enabled = false;
        });
        if (ref.current) {
            ref.current.stopCamera(); // Check if ref.current is not null before accessing stopCamera
        }
    };

    const stopCamera = async () => {
        ref.current.stop()
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: true,
            });
            stream.getTracks().forEach(track => track.stop());
        } catch (error) {
            console.error('Error stopping camera:', error);
        }
    };


    // const barcodeScanned = async (result) => {

    //     clickedOnCloseButton()


    //     if (!scannerPausedRef.current) {

    //         console.log("QrScanner ", result)

    //         // play barcode beep sound
    //         // in apple ipad safari browser issue in playing sound, NotAllowedError user denied permission

    //         try {
    //             let audio = new Audio("/barcode_scan_beep_sound.mp3")
    //             await audio.play()

    //         } catch (err) {
    //             // alert(`err is ${err}`)
    //         }

    //         succesFullyScanned(result)
    //         scannerPausedRef.current = true;
    //         releaseScanner()

    //     } else {
    //         console.log(":P :P Scanner paused please wait ")
    //     }
    // }

    // const barcodeScanned = async (result) => {
    //     succesFullyScanned(result);
    // }

    // const barcodeScanned = useCallback(async (result) => {
    //     if (result) {
    //         succesFullyScanned(result);
    //         scannerRef.current.stopScanning(); // Call stopScanning function on scannerRef.current
    //     }
    // }, []);

    const barcodeScanned = useCallback(async (result) => {
        // clickedOnCloseButton();

        if (result) {
            // succesFullyScanned(result);
            // releaseScanner();

            // try {
            //     let audio = new Audio("/barcode_scan_beep_sound.mp3");
            //     await audio.play();
            // } catch (err) {
            //     // Handle error
            // }
            succesFullyScanned(result);
            // scannerPausedRef.current = true;
            releaseScanner();

            // scannerPausedRef.current.stopScanning(); // Call stopScanning function
        }

        // if (!scannerPausedRef.current) {
        //     console.log("QrScanner ", result);
        //     // Play barcode beep sound
        //     try {
        //         let audio = new Audio("/barcode_scan_beep_sound.mp3");
        //         await audio.play();
        //     } catch (err) {
        //         // Handle error
        //     }
        //     // succesFullyScanned(result);
        //     scannerPausedRef.current = true;
        //     // releaseScanner();
        // } else {
        //     console.log(":P :P Scanner paused please wait ");
        // }
    }, []);


    useEffect(() => {

        return () => {
            if (releaseScannerTimer != null) {
                clearTimeout(releaseScannerTimer)
            }

        }
    }, [])

    // console.log(scannerRef)

    console.log('ref', ref)

    console.log(data)

    return (
        <div className="AdminScanPage-root-container" ref={rootLayoutRef}>

            <div className="Home-inner-container">

                <div className="Home-header-container container p-2">
                    <div>
                        <h5>Scan Qr code</h5>
                        <p>Show your QR code near camera</p>
                    </div>

                    <span>
                        <button onClick={() => clickedOnCloseButton()} className="btn btn-primary">
                            Close
                        </button>
                    </span>

                </div>

                <div className="QrScannerWrapper mx-auto">
                    {/* <Scanner
                        ref={scannerPausedRef}
                        constraints={{ facingMode: 'environment', }}
                        onResult={(result) => barcodeScanned(result)}
                        onError={(error) => { console.log(error) }}

                    /> */}

                    <QrReader
                        ref={ref}
                        constraints={{ facingMode: 'environment', }}
                        onResult={(result, error) => {
                            if (!!result) {
                                // setData(result?.text);
                                setDocumentNumber(result?.text)
                                clickedOnCloseButton()
                                // stopCamera()
                            }

                            if (!!error) {
                                console.error(error);
                            }

                            if (!result) return;

                            // This callback will keep existing even after 
                            // this component is unmounted
                            // So ignore it (only in this reference) if result keeps repeating
                            if (ref.current === result.text) {
                                return
                            }

                            ref.current = result.text;
                            // onResult(result.text);
                        }}
                        style={{ width: '100%' }}
                    />
                    {/* <p>{data}</p> */}
                </div>

            </div>


        </div>
    )
}

export default ScanPopupSingleItem;