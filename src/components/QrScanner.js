import React, { useRef, useEffect } from 'react';
import QrScanner from 'qr-scanner';

const QRScannerComponent = ({ onScan, clickedOnCloseButton }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const scanner = new QrScanner(videoRef.current, result => {
            if (result) {
                onScan(result);
                clickedOnCloseButton()

                try {
                    let audio = new Audio("/barcode_scan_beep_sound.mp3");
                    audio.play().then(() => {
                        // Code to execute after audio has finished playing
                    }).catch(error => {
                        console.error("Error playing audio:", error);
                    });
                } catch (err) {
                    console.error("Error playing audio:", err);
                }
            }
        });

        scanner.start();

        return () => {
            scanner.destroy(); // Cleanup when component unmounts
        };
    }, [onScan]);

    return (

        <div className="AdminScanPage-root-container">

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

                    <video ref={videoRef} style={{ width: '100%' }} />
                </div>

            </div>

        </div>

    );
};

export default QRScannerComponent;
