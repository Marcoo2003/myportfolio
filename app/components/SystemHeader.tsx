"use client";

import { useEffect, useState } from "react";

function calculateUptime() {
  // Simulated deploy date - 142 days ago
  const deployDate = new Date();
  deployDate.setDate(deployDate.getDate() - 142);
  deployDate.setHours(deployDate.getHours() - 6);
  deployDate.setMinutes(deployDate.getMinutes() - 19);
  
  const now = new Date();
  const diff = now.getTime() - deployDate.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${days}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m`;
}

function getLastDeploy() {
  return "00:11:34 UTC";
}

export default function SystemHeader() {
  const [uptime, setUptime] = useState("---d --h --m");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setUptime(calculateUptime());
    
    const interval = setInterval(() => {
      setUptime(calculateUptime());
    }, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  if (!mounted) {
    return (
      <header className="system-header">
        <div className="system-header-inner">
          <div className="system-header-item">
            <span className="system-header-label">SYSTEM STATUS:</span>
            <span className="system-header-status">
              <span className="system-header-value">INITIALIZING</span>
            </span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="system-header">
      <div className="system-header-inner">
        {/* Left side - Status */}
        <div className="system-header-item">
          <span className="system-header-label">SYSTEM STATUS:</span>
          <span className="system-header-status">
            <span className="system-header-value">OPERATIONAL</span>
          </span>
        </div>

        {/* Center - Telemetry */}
        <div className="system-header-item">
          <span className="system-header-label system-header-hide-mobile">UPTIME:</span>
          <span className="system-header-value system-header-hide-mobile">{uptime}</span>
          
          <span className="system-header-separator system-header-hide-mobile" />
          
          <span className="system-header-label">LAST DEPLOY:</span>
          <span className="system-header-value">{getLastDeploy()}</span>
        </div>

        {/* Right side - Environment */}
        <div className="system-header-item">
          <span className="system-header-label">ENV:</span>
          <span className="system-header-value">PROD</span>
        </div>
      </div>
    </header>
  );
}
