import React from 'react';

export function DeletePopup({ isOpen, onClose, onConfirm, transactionDetails }) {
  if (!isOpen) return null;

  const handleConfirmWithAnimation = () => {
    // Create particles
    const createParticles = () => {
      const container = document.querySelector('.popup-content');
      const particleCount = 12;
      const colors = ['#f44336', '#ff7961', '#ba000d'];

      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position and animation
        const angle = (i / particleCount) * 360;
        const velocity = 100 + Math.random() * 50;
        const tx = Math.cos(angle * Math.PI / 180) * velocity;
        const ty = Math.sin(angle * Math.PI / 180) * velocity;
        
        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.width = particle.style.height = 
          `${4 + Math.random() * 6}px`;
        
        container.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => particle.remove(), 600);
      }
    };

    // Add deleting class to preview
    const preview = document.querySelector('.transaction-preview');
    preview.classList.add('deleting');

    // Create particles and trigger delete
    createParticles();
    
    // Wait for animation to complete before actual deletion
    setTimeout(() => {
      onConfirm();
    }, 400);
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h3>Delete Transaction</h3>
        <p>Are you sure you want to delete this transaction?</p>
        <div className="transaction-preview">
          <span className="description">{transactionDetails.description}</span>
          <span className={`amount ${transactionDetails.type}`}>
            {transactionDetails.type === 'expense' ? '-' : '+'}
            ${transactionDetails.amount.toFixed(2)}
          </span>
        </div>
        <div className="popup-actions">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="delete-btn" 
            onClick={handleConfirmWithAnimation}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 