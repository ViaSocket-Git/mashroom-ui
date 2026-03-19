export default function ClaudeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" fill="#D97757" />
      <path d="M12 6l-4 2.5v5L12 16l4-2.5v-5L12 6z" fill="#F5A98A" />
    </svg>
  );
}
