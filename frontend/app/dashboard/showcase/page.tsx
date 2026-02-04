"use client";

import { useState } from "react";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Info,
  Loader2,
  Plus,
  Trash2,
  Edit,
  Send
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { EmptyState } from "@/components/tasks/EmptyState";
import { LoadingSkeleton } from "@/components/tasks/LoadingSkeleton";
import { motion } from "framer-motion";

export default function ComponentShowcase() {
  const [checked, setChecked] = useState(false);
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium mb-4"
          >
            <Sparkles className="h-4 w-4" />
            Component Showcase
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">
            UI Component Library
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A comprehensive collection of production-ready components for the Todo Management application
          </p>
        </div>

        {/* Buttons Section */}
        <Section title="Buttons" description="Various button styles and states">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" disabled>Disabled</Button>
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              With Icon
            </Button>
          </div>
        </Section>

        {/* Badges Section */}
        <Section title="Badges" description="Status and priority indicators">
          <div className="flex flex-wrap gap-3">
            <Badge variant="high">High Priority</Badge>
            <Badge variant="medium">Medium Priority</Badge>
            <Badge variant="low">Low Priority</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="info">Info</Badge>
            <Badge size="sm">Small Badge</Badge>
            <Badge size="lg">Large Badge</Badge>
          </div>
        </Section>

        {/* Cards Section */}
        <Section title="Cards" description="Container components">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <h3 className="text-lg font-semibold mb-2">Basic Card</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                A simple card with default styling and padding.
              </p>
            </Card>
            <Card className="border-l-4 border-l-primary-500">
              <h3 className="text-lg font-semibold mb-2">Accent Card</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Card with a colored left border for emphasis.
              </p>
            </Card>
          </div>
        </Section>

        {/* Form Elements Section */}
        <Section title="Form Elements" description="Input fields and controls">
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-2">Text Input</label>
              <Input
                type="text"
                placeholder="Enter text..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Disabled Input</label>
              <Input
                type="text"
                placeholder="Disabled..."
                disabled
              />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={checked}
                onChange={setChecked}
              />
              <label className="text-sm">Checkbox Example</label>
            </div>
          </div>
        </Section>

        {/* Chat Components Section */}
        <Section title="Chat Components" description="Message bubbles and indicators">
          <div className="space-y-4 max-w-2xl">
            <MessageBubble
              role="user"
              content="Add a task to buy groceries"
              timestamp={new Date().toISOString()}
            />
            <MessageBubble
              role="assistant"
              content="I've added 'Buy groceries' to your tasks."
              timestamp={new Date().toISOString()}
              toolCalls={[
                { tool_name: "create_task", status: "success" }
              ]}
            />
            <TypingIndicator />
          </div>
        </Section>

        {/* Empty States Section */}
        <Section title="Empty States" description="Placeholder states for empty content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <EmptyState
              title="No tasks yet"
              description="Create your first task to get started!"
              icon="tasks"
              action={{
                label: "Create Task",
                onClick: () => alert("Create task clicked!")
              }}
            />
            <EmptyState
              title="Start a conversation"
              description="Ask the AI assistant to help manage your tasks"
              icon="chat"
            />
          </div>
        </Section>

        {/* Loading States Section */}
        <Section title="Loading States" description="Skeleton loaders for content">
          <LoadingSkeleton count={3} />
        </Section>

        {/* Icons Section */}
        <Section title="Icons" description="Lucide React icons used throughout">
          <div className="flex flex-wrap gap-6">
            <IconDemo icon={<Sparkles />} label="Sparkles" />
            <IconDemo icon={<CheckCircle2 />} label="Check" />
            <IconDemo icon={<AlertCircle />} label="Alert" />
            <IconDemo icon={<Info />} label="Info" />
            <IconDemo icon={<Loader2 className="animate-spin" />} label="Loading" />
            <IconDemo icon={<Plus />} label="Plus" />
            <IconDemo icon={<Trash2 />} label="Trash" />
            <IconDemo icon={<Edit />} label="Edit" />
            <IconDemo icon={<Send />} label="Send" />
          </div>
        </Section>

        {/* Color Palette Section */}
        <Section title="Color Palette" description="Primary and semantic colors">
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3">Primary Colors</h4>
              <div className="grid grid-cols-5 gap-2">
                <ColorSwatch color="bg-primary-50" label="50" />
                <ColorSwatch color="bg-primary-100" label="100" />
                <ColorSwatch color="bg-primary-500" label="500" />
                <ColorSwatch color="bg-primary-600" label="600" />
                <ColorSwatch color="bg-primary-900" label="900" />
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-3">Semantic Colors</h4>
              <div className="grid grid-cols-4 gap-2">
                <ColorSwatch color="bg-green-500" label="Success" />
                <ColorSwatch color="bg-red-500" label="Danger" />
                <ColorSwatch color="bg-amber-500" label="Warning" />
                <ColorSwatch color="bg-blue-500" label="Info" />
              </div>
            </div>
          </div>
        </Section>

        {/* Typography Section */}
        <Section title="Typography" description="Text styles and hierarchy">
          <div className="space-y-4">
            <div>
              <h1 className="text-5xl font-bold">Heading 1</h1>
              <p className="text-sm text-gray-500">text-5xl font-bold</p>
            </div>
            <div>
              <h2 className="text-4xl font-bold">Heading 2</h2>
              <p className="text-sm text-gray-500">text-4xl font-bold</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold">Heading 3</h3>
              <p className="text-sm text-gray-500">text-3xl font-bold</p>
            </div>
            <div>
              <p className="text-base">Body text - Regular paragraph with normal weight and size.</p>
              <p className="text-sm text-gray-500">text-base</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Small text - Used for secondary information and captions.</p>
              <p className="text-sm text-gray-500">text-sm text-gray-600</p>
            </div>
          </div>
        </Section>

        {/* Spacing Section */}
        <Section title="Spacing Scale" description="Consistent spacing system">
          <div className="space-y-2">
            {[1, 2, 3, 4, 6, 8, 12, 16].map((size) => (
              <div key={size} className="flex items-center gap-4">
                <div className={`w-${size} h-${size} bg-primary-500 rounded`} />
                <span className="text-sm font-mono">w-{size} / h-{size}</span>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

// Helper Components
function Section({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-1">
          {title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        {children}
      </div>
    </motion.section>
  );
}

function IconDemo({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-300">
        {icon}
      </div>
      <span className="text-xs text-gray-600 dark:text-gray-400">{label}</span>
    </div>
  );
}

function ColorSwatch({ color, label }: { color: string; label: string }) {
  return (
    <div className="space-y-2">
      <div className={`${color} h-16 rounded-lg shadow-sm`} />
      <p className="text-xs text-center text-gray-600 dark:text-gray-400">{label}</p>
    </div>
  );
}
