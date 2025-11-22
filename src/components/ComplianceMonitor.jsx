import { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

/**
 * ComplianceMonitor - Dystopian surveillance component
 * Continuously streams webcam feed to backend for behavioral analysis
 */
const ComplianceMonitor = ({ citizenId }) => {
    const webcamRef = useRef(null);
    const stompClientRef = useRef(null);
    const captureIntervalRef = useRef(null);

    const [connectionStatus, setConnectionStatus] = useState('Disconnected');
    const [alertMessage, setAlertMessage] = useState(null);
    const [framesSent, setFramesSent] = useState(0);
    const [lastFrameTime, setLastFrameTime] = useState(null);
    const [isCapturing, setIsCapturing] = useState(false);

    useEffect(() => {
        if (!citizenId) {
            console.error('No citizenId provided to ComplianceMonitor');
            return;
        }

        // Initialize STOMP client connection
        const client = new Client({
            webSocketFactory: () => new SockJS('http://localhost:8080/ws'),

            onConnect: () => {
                console.log('🔴 SURVEILLANCE ACTIVE');
                setConnectionStatus('Connected');

                // Subscribe to personal alert channel - /topic/alerts/{citizenNumber}
                client.subscribe(`/topic/alerts/${citizenId}`, (message) => {
                    try {
                        const alert = JSON.parse(message.body);
                        console.log('⚠️ ALERT RECEIVED:', alert);
                        console.log(`Penalty: -${alert.penaltyPoints} points`);

                        // Trigger punishment UI with the alert message
                        setAlertMessage(alert.message);

                        // Auto-clear alert after 5 seconds
                        setTimeout(() => setAlertMessage(null), 5000);
                    } catch (error) {
                        console.error('Failed to parse alert:', error);
                        setAlertMessage(message.body);
                        setTimeout(() => setAlertMessage(null), 5000);
                    }
                });

                // Start the capture loop once connected
                startCaptureLoop();
            },

            onDisconnect: () => {
                console.log('🔴 SURVEILLANCE DISCONNECTED');
                setConnectionStatus('Disconnected');
                stopCaptureLoop();
            },

            onStompError: (frame) => {
                console.error('STOMP error:', frame);
                setConnectionStatus('Error');
            },

            // Reconnect settings
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        });

        stompClientRef.current = client;
        client.activate();

        // Cleanup on unmount
        return () => {
            stopCaptureLoop();
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [citizenId]);

    /**
   * Start the video capture loop (2 FPS)
   */
    const startCaptureLoop = () => {
        if (captureIntervalRef.current) return; // Already running

        setIsCapturing(true);
        captureIntervalRef.current = setInterval(() => {
            captureAndSendFrame();
        }, 500); // 500ms = 2 frames per second
    };

    /**
     * Stop the video capture loop
     */
    const stopCaptureLoop = () => {
        if (captureIntervalRef.current) {
            clearInterval(captureIntervalRef.current);
            captureIntervalRef.current = null;
            setIsCapturing(false);
        }
    };

    /**
   * Capture frame from webcam and send to backend
   */
    const captureAndSendFrame = () => {
        if (!webcamRef.current || !stompClientRef.current?.connected) {
            return;
        }

        try {
            // Check if webcam is ready (video element has dimensions)
            const video = webcamRef.current.video;
            if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
                return; // Webcam not ready yet, skip this frame
            }

            // Capture screenshot as base64 data URI
            const screenshot = webcamRef.current.getScreenshot();

            if (!screenshot) {
                return; // Skip silently if capture fails
            }

            // Strip the data URI prefix to get raw base64 string
            // Format: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
            const base64Data = screenshot.replace(/^data:image\/jpeg;base64,/, '');

            // Send to backend via STOMP
            stompClientRef.current.publish({
                destination: '/app/stream/video',
                body: base64Data,
                headers: {
                    'citizenNumber': citizenId || 'UNKNOWN',
                },
            });

            // Update metrics
            setFramesSent(prev => prev + 1);
            setLastFrameTime(new Date().toLocaleTimeString());

        } catch (error) {
            console.error('Frame capture error:', error);
        }
    };

    return (
        <div className="compliance-monitor">
            {/* Live Video Preview Panel */}
            <div className="fixed bottom-4 right-4 z-50 bg-gray-900 border-2 border-red-600 rounded-lg overflow-hidden shadow-2xl">
                <div className="bg-red-600 text-white px-4 py-2 font-bold text-sm flex items-center justify-between">
                    <span>🔴 LIVE SURVEILLANCE FEED</span>
                    <span className="text-xs font-mono">{citizenId}</span>
                </div>

                {/* Video Feed */}
                <div className="relative">
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{
                            width: 640,
                            height: 480,
                            facingMode: 'user',
                        }}
                        className="w-80 h-60 object-cover"
                    />

                    {/* Recording Indicator */}
                    {isCapturing && (
                        <div className="absolute top-2 left-2 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                            RECORDING
                        </div>
                    )}

                    {/* Frame Rate Indicator */}
                    <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-green-400 px-2 py-1 rounded text-xs font-mono">
                        2 FPS
                    </div>
                    {/* Traffic Light Indicators */}
                    <div className="absolute top-2 left-2 flex space-x-2">
                        <span className="w-3 h-3 bg-red-600 rounded-full"></span>
                        <span className="w-3 h-3 bg-yellow-600 rounded-full"></span>
                        <span className="w-3 h-3 bg-green-600 rounded-full"></span>
                    </div>
                </div>

                {/* Status Panel */}
                <div className="bg-gray-800 text-white p-3 space-y-2 text-xs font-mono">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Connection:</span>
                        <span className={`font-bold ${connectionStatus === 'Connected' ? 'text-green-400' :
                            connectionStatus === 'Error' ? 'text-red-400' : 'text-gray-400'
                            }`}>
                            {connectionStatus.toUpperCase()}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Frames Sent:</span>
                        <span className="text-blue-400 font-bold">{framesSent}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Last Frame:</span>
                        <span className="text-purple-400">{lastFrameTime || 'N/A'}</span>
                    </div>

                    <div className="flex justify-between items-center">
                        <span className="text-gray-400">Destination:</span>
                        <span className="text-yellow-400">/app/stream/video</span>
                    </div>

                    <div className="pt-2 border-t border-gray-700">
                        <div className="text-gray-400 mb-1">Behavioral States:</div>
                        <div className="grid grid-cols-3 gap-1 text-[10px]">
                            <div className="bg-green-900 text-green-300 px-1 py-0.5 rounded text-center">
                                ✓ FOCUSED
                            </div>
                            <div className="bg-yellow-900 text-yellow-300 px-1 py-0.5 rounded text-center">
                                ⚠ DISTRACTED
                            </div>
                            <div className="bg-red-900 text-red-300 px-1 py-0.5 rounded text-center">
                                ✗ ABSENT
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Punishment UI - Alert Overlay */}
            {alertMessage && (
                <div className="fixed inset-0 z-40 pointer-events-none">
                    {/* Flashing Red Border */}
                    <div className="absolute inset-0 border-8 border-red-600 animate-pulse"
                        style={{
                            animation: 'flash 0.5s infinite',
                            boxShadow: 'inset 0 0 50px rgba(220, 38, 38, 0.5)'
                        }} />

                    {/* Alert Message */}
                    <div className="absolute top-0 left-0 right-0 bg-red-600 text-white py-8 px-4 text-center">
                        <div className="text-4xl font-bold uppercase tracking-wider animate-pulse">
                            ⚠️ COMPLIANCE VIOLATION ⚠️
                        </div>
                        <div className="text-6xl font-black mt-4 drop-shadow-lg">
                            {alertMessage}
                        </div>
                        <div className="text-2xl mt-4 font-mono">
                            YOUR SOCIAL SCORE HAS BEEN ADJUSTED
                        </div>
                    </div>
                </div>
            )}

            {/* Flash Animation Styles */}
            <style>{`
        @keyframes flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
        </div>
    );
};

export default ComplianceMonitor;
