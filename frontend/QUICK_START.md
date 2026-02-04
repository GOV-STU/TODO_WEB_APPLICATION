# Quick Start Guide - Todo Management UI

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

```bash
cd frontend
npm install
```

Required packages (should already be in package.json):
- `framer-motion` - Smooth animations
- `lucide-react` - Beautiful icons
- `clsx` & `tailwind-merge` - Utility class management
- `sonner` - Toast notifications

### Step 2: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Step 3: Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs

### Step 4: Navigate to Unified Dashboard

Go to: http://localhost:3000/dashboard/unified

This is the main production-ready interface with:
- ✅ Split-screen layout (desktop)
- ✅ Tab navigation (mobile)
- ✅ AI chatbot integration
- ✅ Real-time task updates

---

## 🎯 Key Routes

| Route | Description | Best For |
|-------|-------------|----------|
| `/dashboard/unified` | **Recommended** - Split view with tasks & chat | Desktop & Mobile |
| `/dashboard` | Original tasks-only view | Tasks focus |
| `/dashboard/chat` | Standalone chat interface | Chat focus |
| `/login` | Authentication page | Sign in |
| `/signup` | Registration page | New users |

---

## 💡 Usage Examples

### Example 1: Create a Task via Chat

1. Navigate to `/dashboard/unified`
2. In the chat panel, type: "Add a task to buy groceries"
3. Watch the AI create the task
4. See it appear in the tasks panel immediately

### Example 2: Filter Tasks

1. Click on filter buttons: "All", "Pending", "Completed"
2. Tasks update instantly
3. Pending count updates in real-time

### Example 3: Complete a Task

**Method 1 - Direct:**
- Click the checkbox on any task card
- Watch the smooth animation

**Method 2 - Via Chat:**
- Type: "Mark the groceries task as complete"
- AI finds and completes the task

### Example 4: Mobile Experience

1. Open on mobile device or resize browser
2. See tab navigation appear
3. Switch between "Tasks" and "AI Chat"
4. Use floating action button (FAB) to create tasks

---

## 🎨 Customization Guide

### Change Primary Color

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: {
    50: '#f0f9ff',   // Lightest
    500: '#0ea5e9',  // Main color
    600: '#0284c7',  // Hover state
    900: '#0c4a6e',  // Darkest
  }
}
```

### Adjust Animation Speed

In component files:

```tsx
// Faster
transition={{ duration: 0.15 }}

// Slower
transition={{ duration: 0.4 }}

// Custom easing
transition={{ ease: [0.16, 1, 0.3, 1] }}
```

### Modify Layout Breakpoints

```tsx
// Show on mobile only
className="lg:hidden"

// Show on tablet and up
className="hidden md:block"

// Custom breakpoint
className="hidden xl:flex"
```

---

## 🐛 Troubleshooting

### Issue: Chat not updating tasks

**Solution:**
```tsx
// Make sure onTaskUpdate is passed to ChatWindow
<ChatWindow onTaskUpdate={loadTasks} />
```

### Issue: Animations not smooth

**Solution:**
1. Check if Framer Motion is installed: `npm list framer-motion`
2. Ensure GPU acceleration: Add `will-change-transform` class
3. Reduce animation complexity on low-end devices

### Issue: Mobile tabs not showing

**Solution:**
- Check viewport width: Tabs show below 1024px
- Verify `viewMode` state is working
- Check for CSS conflicts

### Issue: Dark mode not working

**Solution:**
1. Verify ThemeProvider is wrapping the app
2. Check `darkMode: "class"` in tailwind.config.ts
3. Ensure dark: variants are in Tailwind classes

---

## 📱 Mobile Testing Checklist

- [ ] Tab navigation works smoothly
- [ ] FAB (floating action button) is accessible
- [ ] Touch targets are at least 44x44px
- [ ] Scrolling is smooth with momentum
- [ ] Keyboard doesn't cover input fields
- [ ] Landscape mode works correctly
- [ ] Swipe gestures feel natural

---

## ⚡ Performance Tips

### 1. Lazy Load Heavy Components

```tsx
import dynamic from 'next/dynamic';

const ChatWindow = dynamic(() => import('@/components/chat/ChatWindow'), {
  loading: () => <LoadingSkeleton count={3} />,
});
```

### 2. Optimize Images

```tsx
import Image from 'next/image';

<Image
  src="/avatar.png"
  width={32}
  height={32}
  alt="User avatar"
  priority={false}
/>
```

### 3. Debounce Search/Filter

```tsx
import { useDebouncedCallback } from 'use-debounce';

const debouncedSearch = useDebouncedCallback(
  (value) => setSearchTerm(value),
  300
);
```

### 4. Virtualize Long Lists

For 100+ tasks, use `react-window`:

```tsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={tasks.length}
  itemSize={80}
>
  {({ index, style }) => (
    <div style={style}>
      <TaskCard task={tasks[index]} />
    </div>
  )}
</FixedSizeList>
```

---

## 🔒 Security Best Practices

1. **Never expose API keys** in frontend code
2. **Validate all user input** before sending to API
3. **Use environment variables** for configuration
4. **Implement rate limiting** on API calls
5. **Sanitize chat messages** to prevent XSS

---

## 🎓 Learning Resources

### Recommended Reading Order

1. **UI_DOCUMENTATION.md** - Complete component reference
2. **This file** - Quick start and examples
3. **Tailwind CSS Docs** - Styling reference
4. **Framer Motion Docs** - Animation guide
5. **Next.js App Router** - Routing and data fetching

### Video Tutorials

- Next.js 16 App Router: [Next.js Learn](https://nextjs.org/learn)
- Tailwind CSS: [Tailwind Labs YouTube](https://www.youtube.com/c/TailwindLabs)
- Framer Motion: [Framer Motion Docs](https://www.framer.com/motion/)

---

## 🚢 Deployment Checklist

### Before Deploying

- [ ] Run `npm run build` successfully
- [ ] Test on multiple devices and browsers
- [ ] Verify all environment variables are set
- [ ] Check API endpoints are correct
- [ ] Test authentication flow
- [ ] Verify dark mode works
- [ ] Check mobile responsiveness
- [ ] Test chat functionality
- [ ] Verify task CRUD operations
- [ ] Check loading states
- [ ] Test error handling

### Deployment Platforms

**Recommended: Vercel (Frontend) + Railway (Backend)**

```bash
# Frontend
vercel --prod

# Backend
railway up
```

**Alternative: Netlify + Heroku**

```bash
# Frontend
netlify deploy --prod

# Backend
git push heroku main
```

---

## 📊 Monitoring & Analytics

### Add Analytics

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Error Tracking

```tsx
// Use Sentry or similar
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
});
```

---

## 🎉 What's Next?

### Suggested Enhancements

1. **Add task categories/tags**
2. **Implement task search**
3. **Add task attachments**
4. **Create task templates**
5. **Add recurring tasks**
6. **Implement task sharing**
7. **Add calendar view**
8. **Create task statistics dashboard**

### Community

- Report issues on GitHub
- Share your customizations
- Contribute improvements
- Request new features

---

**Happy Building! 🚀**

Need help? Check the full documentation in `UI_DOCUMENTATION.md`
