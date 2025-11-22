import { useState } from 'react';
import ComplianceMonitor from '../components/ComplianceMonitor';

/**
 * Example usage of the ComplianceMonitor component
 * 
 * This demonstrates how to integrate the surveillance system
 * into your Tiering Machine application.
 */
function ComplianceMonitorExample() {
    // In a real app, get this from your auth context or user state
    const [citizenId, setCitizenId] = useState('CITIZEN-001');
    const [isMonitoring, setIsMonitoring] = useState(true);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 text-red-500">
                    🔴 COMPLIANCE MONITORING SYSTEM
                </h1>

                {/* Control Panel */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Control Panel</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Citizen ID
                            </label>
                            <input
                                type="text"
                                value={citizenId}
                                onChange={(e) => setCitizenId(e.target.value)}
                                className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 focus:border-red-500 focus:outline-none"
                                placeholder="e.g., CITIZEN-001"
                            />
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsMonitoring(!isMonitoring)}
                                className={`px-6 py-2 rounded font-semibold transition-colors ${isMonitoring
                                        ? 'bg-red-600 hover:bg-red-700'
                                        : 'bg-green-600 hover:bg-green-700'
                                    }`}
                            >
                                {isMonitoring ? '🔴 STOP SURVEILLANCE' : '▶️ START SURVEILLANCE'}
                            </button>

                            <span className="text-sm text-gray-400">
                                Status: {isMonitoring ? 'ACTIVE' : 'INACTIVE'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Information Panel */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">System Information</h2>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Backend URL:</span>
                            <span className="font-mono">http://localhost:8080/ws</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Alert Channel:</span>
                            <span className="font-mono">/topic/alerts/{citizenId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Stream Destination:</span>
                            <span className="font-mono">/app/stream/video</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Capture Rate:</span>
                            <span className="font-mono">2 FPS (500ms interval)</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Violation Threshold:</span>
                            <span className="font-mono">5 consecutive frames</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Penalty:</span>
                            <span className="font-mono text-red-500">-10 Social Credit Points</span>
                        </div>
                    </div>
                </div>

                {/* Behavioral States */}
                <div className="bg-gray-800 rounded-lg p-6">
                    <h2 className="text-2xl font-semibold mb-4">Behavioral States</h2>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-green-900 border border-green-700 rounded p-4">
                            <div className="text-2xl mb-2">✅</div>
                            <div className="font-semibold">FOCUSED</div>
                            <div className="text-xs text-gray-400 mt-1">
                                Frontal face detected
                            </div>
                        </div>

                        <div className="bg-yellow-900 border border-yellow-700 rounded p-4">
                            <div className="text-2xl mb-2">⚠️</div>
                            <div className="font-semibold">DISTRACTED</div>
                            <div className="text-xs text-gray-400 mt-1">
                                Profile face detected
                            </div>
                        </div>

                        <div className="bg-red-900 border border-red-700 rounded p-4">
                            <div className="text-2xl mb-2">❌</div>
                            <div className="font-semibold">ABSENT</div>
                            <div className="text-xs text-gray-400 mt-1">
                                No face detected
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* The Surveillance Component */}
            {isMonitoring && <ComplianceMonitor citizenId={citizenId} />}
        </div>
    );
}

export default ComplianceMonitorExample;
