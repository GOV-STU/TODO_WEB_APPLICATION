# Todo Management Frontend - Production UI

A modern, responsive, and accessible web application built with Next.js 16, TypeScript, Tailwind CSS, and Framer Motion.

## 🎨 Features

### ✨ Core Features
- **Unified Dashboard**: Split-screen layout combining tasks and AI chat
- **AI Chat Assistant**: Natural language task management with Cohere
- **Real-time Updates**: Tasks update immediately when modified via chat
- **Responsive Design**: Mobile-first with adaptive layouts
- **Dark Mode**: Full dark mode support with smooth transitions
- **Animations**: Smooth micro-interactions with Framer Motion
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

### 📱 Mobile Optimizations
- Tab-based navigation for easy switching
- Touch-friendly interactions (44x44px minimum)
- Floating action button for quick task creation
- Optimized scrolling with momentum
- Responsive typography and spacing

### 🎯 Task Management
- Create, read, update, delete tasks
- Priority levels (low, medium, high)
- Due dates with smart formatting
- Task completion with animations
- Filter by status (all, pending, completed)

### 💬 AI Chat Features
- Natural language task operations
- Tool call indicators showing actions taken
- Typing animation while AI responds
- Auto-scrolling to latest messages
- Message history persistence

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Backend server running on port 8001

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Edit .env.local with your values
NEXT_PUBLIC_API_URL=http://localhost:8001
```

### Development

```bash
# Start development server
npm run dev

# Open browser
# http://localhost:3000
```

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── dashboard/
│   │   ├── unified/             # ⭐ Main unified dashboard
│   │   │   └── page.tsx
│   │   ├── showcase/            # Component showcase
│   │   │   └── page.tsx
│   │   ├── chat/                # Standalone chat
│   │   │   └── page.tsx
│   │   └── page.tsx             # Original dashboard
│   ├── login/
│   │   └── page.tsx
│   ├── signup/
│   │   └── page.tsx
│   └── layout.tsx
│
├── components/
│   ├── chat/                    # Chat components
│   │   ├── ChatWindow.tsx       # Main chat container
│   │   ├── MessageList.tsx      # Message list with scroll
│   │   ├── MessageBubble.tsx    # Individual message
│   │   ├── MessageInput.tsx     # Auto-resize input
│   │   └── TypingIndicator.tsx  # Animated typing dots
│   │
│   ├── tasks/                   # Task components
│   │   ├── TaskList.tsx         # Task list container
│   │   ├── TaskCard.tsx         # Individual task card
│   │   ├── TaskForm.tsx         # Create/edit modal
│   │   ├── EmptyState.tsx       # Empty state with CTA
│   │   └── LoadingSkeleton.tsx  # Loading placeholders
│   │
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Select.tsx
│   │   └── Textarea.tsx
│   │
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── MobileBottomNav.tsx
│   │
│   └── providers/
│       └── ThemeProvider.tsx
│
├── lib/                         # Utilities and helpers
│   ├── api.ts                   # API client
│   ├── utils.ts                 # cn() utility
│   ├── hooks.ts                 # Custom React hooks
│   ├── helpers.ts               # Helper functions
│   └── constants.ts             # App constants
│
├── types/                       # TypeScript types
│   ├── task.ts
│   ├── chat.ts
│   └── api.ts
│
├── public/                      # Static assets
│
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript config
├── next.config.js               # Next.js config
│
└── Documentation/
    ├── UI_DOCUMENTATION.md      # Complete component reference
    ├── QUICK_START.md           # Quick start guide
    └── IMPLEMENTATION_COMPLETE.md # Implementation summary
```

---

## 🎯 Key Routes

| Route | Description | Recommended |
|-------|-------------|-------------|
| `/dashboard/unified` | Split-screen tasks + chat | ⭐ Yes |
| `/dashboard` | Tasks only view | - |
| `/dashboard/chat` | Chat only view | - |
| `/dashboard/showcase` | Component showcase | For developers |
| `/login` | Sign in page | - |
| `/signup` | Sign up page | - |

---

## 💻 Usage Examples

### Using the Unified Dashboard

```tsx
// This is the recommended way to use the app
// Navigate to: /dashboard/unified

// Features:
// - Desktop: Split-screen (tasks left, chat right)
// - Mobile: Tab navigation
// - Real-time sync between chat and tasks
```

### Creating Tasks via Chat

```
User: "Add a task to buy groceries"
AI: Creates task and confirms

User: "Show my tasks"
AI: Lists all tasks

User: "Mark the groceries task as complete"
AI: Completes the task

User: "Delete completed tasks"
AI: Removes completed tasks
```

### Using Custom Hooks

```tsx
import { useIsMobile, useDebounce, useLocalStorage } from '@/lib/hooks';

function MyComponent() {
  const isMobile = useIsMobile();
  const [filter, setFilter] = useLocalStorage('filter', 'all');
  const debouncedSearch = useDebounce(searchTerm, 300);

  return (
    <div>
      {isMobile ? <MobileView /> : <DesktopView />}
    </div>
  );
}
```

### Using Helper Functions

```tsx
import { formatRelativeDate, truncate, getPriorityColor } from '@/lib/helpers';

function TaskCard({ task }) {
  return (
    <div className={getPriorityColor(task.priority)}>
      <h3>{truncate(task.title, 50)}</h3>
      <span>{formatRelativeDate(task.dueDate)}</span>
    </div>
  );
}
```

---

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-color',
        600: '#your-darker-color',
      }
    }
  }
}
```

### Adjusting Animations

```tsx
// In component files
transition={{ duration: 0.15 }}  // Faster
transition={{ duration: 0.4 }}   // Slower
```

### Modifying Breakpoints

```tsx
// Show on mobile only
className="lg:hidden"

// Show on desktop only
className="hidden lg:block"
```

---

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler

# Testing (if configured)
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
```

---

## 📚 Documentation

- **[UI_DOCUMENTATION.md](./UI_DOCUMENTATION.md)** - Complete component reference and design system
- **[QUICK_START.md](./QUICK_START.md)** - Quick start guide with examples
- **[IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md)** - Implementation summary

---

## 🏗️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: Sonner
- **State**: React Hooks + Server Components

---

## 🎯 Best Practices

### Component Organization
- Use Server Components by default
- Add "use client" only when needed
- Keep components small and focused
- Extract reusable logic into hooks

### Styling
- Use Tailwind utility classes
- Avoid inline styles
- Use the `cn()` utility for conditional classes
- Follow mobile-first approach

### Performance
- Lazy load heavy components
- Use Next.js Image component
- Implement virtual scrolling for long lists
- Debounce search and filter inputs

### Accessibility
- Add ARIA labels to interactive elements
- Support keyboard navigation
- Ensure sufficient color contrast
- Test with screen readers

---

## 🐛 Troubleshooting

### Chat not updating tasks
**Solution**: Ensure `onTaskUpdate` prop is passed to ChatWindow

### Animations not smooth
**Solution**: Check Framer Motion is installed and GPU acceleration is enabled

### Mobile tabs not showing
**Solution**: Verify viewport width detection and CSS breakpoints

### Dark mode not working
**Solution**: Check ThemeProvider is wrapping the app

---

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

---

## 📊 Performance Targets

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: > 90
- **Animation FPS**: 60fps

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📝 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first approach
- Framer Motion for smooth animations
- Lucide for beautiful icons

---

## 📞 Support

- **Documentation**: Check the docs folder
- **Issues**: Report on GitHub
- **Questions**: Open a discussion

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
