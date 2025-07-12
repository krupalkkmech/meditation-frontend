import React, { useEffect, useState } from 'react';

import pwaService from '../services/pwa';

const InstallPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if PWA can be installed
    const checkInstallability = () => {
      if (pwaService.canInstall()) {
        setShowPrompt(true);
      }
    };

    // Check immediately
    checkInstallability();

    // Check periodically
    const interval = setInterval(checkInstallability, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleInstall = async () => {
    setIsInstalling(true);
    try {
      const success = await pwaService.showInstallPrompt();
      if (success) {
        setShowPrompt(false);
      }
    } catch (error) {
      console.error('Install failed:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) {
    return null;
  }

  return (
    <div className="install-prompt">
      <div className="install-prompt-content">
        <div className="install-prompt-icon">📱</div>
        <div className="install-prompt-text">
          <h3>Install TimeFlow</h3>
          <p>
            Add to your home screen for quick access to your schedule and time
            management tools
          </p>
        </div>
        <div className="install-prompt-actions">
          <button
            className="install-prompt-btn install"
            onClick={handleInstall}
            disabled={isInstalling}
          >
            {isInstalling ? 'Installing...' : 'Install'}
          </button>
          <button
            className="install-prompt-btn dismiss"
            onClick={handleDismiss}
            disabled={isInstalling}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
