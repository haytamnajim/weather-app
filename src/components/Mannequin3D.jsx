import React from 'react';
import '../MinimalistStyles.css';
import './Mannequin.css';

const Mannequin3D = ({ lookImage, isLoading }) => {
    return (
        <div className="mannequin-container">
            <div className="mannequin-card">
                <h3 className="mannequin-title">👗 Votre Look</h3>

                {isLoading ? (
                    <div className="mannequin-loading">
                        <div className="mannequin-spinner"></div>
                        <p>Génération du look...</p>
                    </div>
                ) : lookImage ? (
                    <div className="mannequin-image-wrapper">
                        <img
                            src={lookImage}
                            alt="Look recommandé"
                            className="mannequin-image"
                        />
                    </div>
                ) : (
                    <div className="mannequin-placeholder">
                        <div className="mannequin-silhouette">
                            <svg viewBox="0 0 100 200" className="mannequin-svg">
                                {/* Tête */}
                                <ellipse cx="50" cy="20" rx="15" ry="18" fill="#64748b" opacity="0.6" />
                                {/* Corps */}
                                <path d="M30 45 Q50 40 70 45 L75 100 Q50 105 25 100 Z" fill="#64748b" opacity="0.5" />
                                {/* Bras gauche */}
                                <path d="M25 50 Q10 70 15 100" stroke="#64748b" strokeWidth="8" fill="none" opacity="0.5" strokeLinecap="round" />
                                {/* Bras droit */}
                                <path d="M75 50 Q90 70 85 100" stroke="#64748b" strokeWidth="8" fill="none" opacity="0.5" strokeLinecap="round" />
                                {/* Jambe gauche */}
                                <path d="M35 100 L30 180" stroke="#64748b" strokeWidth="10" fill="none" opacity="0.5" strokeLinecap="round" />
                                {/* Jambe droite */}
                                <path d="M65 100 L70 180" stroke="#64748b" strokeWidth="10" fill="none" opacity="0.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <p className="mannequin-hint">Demandez un look à l'assistant IA pour voir le résultat ici !</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Mannequin3D;
