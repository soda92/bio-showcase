// components/Card.tsx

export function Card({ link, title, description, icon }: {
  link: string;
  title: string;
  description: string;
  icon: 'primer' | 'alignment' | 'tutorial';
}) {
  let svgIcon = null;
  if (icon === 'primer') {
    svgIcon = (
      <svg class="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    );
  } else if (icon === 'alignment') {
    svgIcon = (
      <svg class="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
      </svg>
    );
  } else {
    svgIcon = (
      <svg class="h-8 w-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    );
  }

  return (
    <a
      href={link}
      class="group bg-gray-900/40 hover:bg-gray-900/70 border border-gray-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 shadow-xl hover:shadow-indigo-500/5 backdrop-blur-sm flex flex-col justify-between h-64 cursor-pointer"
    >
      <div>
        <div class="p-3 bg-gray-800/80 rounded-xl w-fit mb-5 group-hover:scale-110 transition-transform duration-300">
          {svgIcon}
        </div>
        <h3 class="text-lg font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">
          {title}
        </h3>
        <p class="text-gray-400 text-sm leading-relaxed">
          {description}
        </p>
      </div>
      <div class="flex items-center text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 mt-4">
        <span>Launch Module</span>
        <svg class="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </a>
  );
}
