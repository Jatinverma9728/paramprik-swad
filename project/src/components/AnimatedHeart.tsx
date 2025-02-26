import React from 'react';
import styled from 'styled-components';

interface AnimatedHeartProps {
  isChecked: boolean;
  onChange: () => void;
}

export const AnimatedHeart: React.FC<AnimatedHeartProps> = ({ isChecked, onChange }) => {
  return (
    <StyledWrapper>
      <button 
        className={`heart-btn ${isChecked ? 'active' : ''}`}
        onClick={onChange}
        aria-label="Add to wishlist"
      >
        <svg viewBox="0 0 24 24" className="heart">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .heart-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    background: none;
    border: none;
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.9);
    }
  }

  .heart {
    width: 100%;
    height: 100%;
    fill: none;
    stroke: #ff5252;
    stroke-width: 2;
    transition: all 0.2s ease;
  }

  .heart-btn.active .heart {
    fill: #ff5252;
    transform: scale(1);
    animation: heartPop 0.2s ease-out;
  }

  @keyframes heartPop {
    0% {
      transform: scale(0.8);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
`;

export default AnimatedHeart;
