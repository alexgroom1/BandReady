export const CONFETTI_CSS = `
  @keyframes confetti-fall {
    to { transform: translateY(100vh) rotate(720deg); opacity: 0; }
  }
  .animate-confetti-fall {
    animation: confetti-fall 4s ease-out forwards;
  }
  @media (prefers-reduced-motion: reduce) {
    .animate-confetti-fall { animation: none; }
  }
`;
