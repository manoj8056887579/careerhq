"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Trash2, GripVertical, Type, AlignLeft } from "lucide-react";
import type { BlogContent } from "@/types/blog";

interface ContentEditorProps {
  content: BlogContent[];
  onChange: (content: BlogContent[]) => void;
}

interface ContentBlock extends BlogContent {
  id: string;
}

const CONTENT_TYPES = [
  { key: "heading", label: "Heading", icon: Type },
  { key: "paragraph", label: "Paragraph", icon: AlignLeft },
] as const;

// Get placeholder text based on content type
const getPlaceholder = (type: "heading" | "paragraph"): string => {
  switch (type) {
    case "heading":
      return "Enter heading text...";
    case "paragraph":
      return "Enter paragraph content...";
    default:
      return "Enter content...";
  }
};

// Memoized ContentBlock component to prevent unnecessary re-renders
interface ContentBlockComponentProps {
  block: ContentBlock;
  index: number;
  totalBlocks: number;
  onUpdate: (
    blockId: string,
    field: keyof Omit<ContentBlock, "id">,
    value: string
  ) => void;
  onMove: (blockId: string, direction: "up" | "down") => void;
  onRemove: (blockId: string) => void;
}

const ContentBlockComponent = memo(function ContentBlockComponent({
  block,
  index,
  totalBlocks,
  onUpdate,
  onMove,
  onRemove,
}: ContentBlockComponentProps) {
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      onUpdate(block.id, "text", e.target.value);
    },
    [block.id, onUpdate]
  );

  const handleTypeChange = useCallback(
    (keys: Set<React.Key> | "all") => {
      if (keys === "all") return;
      const newType = Array.from(keys)[0] as "heading" | "paragraph";
      onUpdate(block.id, "type", newType);
    },
    [block.id, onUpdate]
  );

  const ContentTypeIcon =
    CONTENT_TYPES.find((type) => type.key === block.type)?.icon || AlignLeft;

  const renderInput = () => {
    const commonProps = {
      value: block.text,
      onChange: handleTextChange,
      placeholder: getPlaceholder(block.type),
      variant: "bordered" as const,
    };

    switch (block.type) {
      case "heading":
        return (
          <Input
            {...commonProps}
            size="lg"
            classNames={{
              input: "text-lg font-semibold",
            }}
          />
        );
      case "paragraph":
        return <Textarea {...commonProps} minRows={3} maxRows={8} />;
      default:
        return <Textarea {...commonProps} minRows={2} maxRows={6} />;
    }
  };

  return (
    <Card className="relative">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <GripVertical size={16} className="text-default-400 cursor-move" />
            <ContentTypeIcon size={16} className="text-default-500" />
            <Select
              size="sm"
              variant="flat"
              selectedKeys={[block.type]}
              onSelectionChange={handleTypeChange}
              className="w-32"
              aria-label="Content type"
            >
              {CONTENT_TYPES.map(({ key, label }) => (
                <SelectItem key={key}>{label}</SelectItem>
              ))}
            </Select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onMove(block.id, "up")}
              isDisabled={index === 0}
              aria-label="Move up"
            >
              ↑
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onPress={() => onMove(block.id, "down")}
              isDisabled={index === totalBlocks - 1}
              aria-label="Move down"
            >
              ↓
            </Button>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={() => onRemove(block.id)}
              aria-label="Delete block"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="pt-3">
        {renderInput()}
        {!block.text.trim() && (
          <p className="text-xs text-default-400 mt-1">
            This {block.type} is empty. Add some content to include it in your
            blog post.
          </p>
        )}
      </CardBody>
    </Card>
  );
});

export default function ContentEditor({
  content,
  onChange,
}: ContentEditorProps) {
  // Convert content to blocks with IDs for easier manipulation
  const [blocks, setBlocks] = useState<ContentBlock[]>(() => {
    const initialBlocks = content.map((item, index) => ({
      ...item,
      id: item.id || `block-${index}-${Date.now()}`,
    }));
    return initialBlocks;
  });

  const previousContentRef = useRef<BlogContent[]>([]);

  // Update blocks when content prop changes (important for edit mode)
  useEffect(() => {
    // Only update if content has actually changed from the previous content
    // and if the change is not from our own updateContent function
    const contentChanged =
      JSON.stringify(previousContentRef.current) !== JSON.stringify(content);

    if (contentChanged && content.length !== blocks.length) {
      // Only update if the structure has changed (different number of blocks)
      // This prevents re-rendering when just text content changes
      const newBlocks = content.map((item, index) => ({
        ...item,
        id: item.id || blocks[index]?.id || `block-${index}-${Date.now()}`,
      }));
      setBlocks(newBlocks);
      previousContentRef.current = content;
    } else if (contentChanged) {
      // If only content changed but structure is the same, update existing blocks
      const updatedBlocks = blocks.map((block, index) => ({
        ...block,
        ...content[index],
        id: block.id, // Keep the existing ID to maintain component identity
      }));
      setBlocks(updatedBlocks);
      previousContentRef.current = content;
    }
  }, [content, blocks.length, blocks]);

  // Update parent component when blocks change
  const updateContent = (newBlocks: ContentBlock[]) => {
    setBlocks(newBlocks);
    const contentWithoutIds = newBlocks.map(({ id: _id, ...block }) => block);
    // Update the ref to prevent the useEffect from triggering unnecessarily
    previousContentRef.current = contentWithoutIds;
    onChange(contentWithoutIds);
  };

  // Add a new content block
  const addBlock = (type: "heading" | "paragraph") => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      text: "",
    };

    updateContent([...blocks, newBlock]);
  };

  // Remove a content block
  const removeBlock = (blockId: string) => {
    const newBlocks = blocks.filter((block) => block.id !== blockId);
    updateContent(newBlocks);
  };

  // Update block content
  const updateBlock = useCallback(
    (blockId: string, field: keyof Omit<ContentBlock, "id">, value: string) => {
      // Update the blocks state directly without triggering a full re-render
      setBlocks((prevBlocks) => {
        const newBlocks = prevBlocks.map((block) =>
          block.id === blockId ? { ...block, [field]: value } : block
        );

        return newBlocks;
      });
    },
    []
  );

  // Sync blocks to parent component using useEffect to avoid setState during render
  useEffect(() => {
    const contentWithoutIds = blocks.map(({ id: _id, ...block }) => block);

    // Only update if content actually changed
    if (
      JSON.stringify(contentWithoutIds) !==
      JSON.stringify(previousContentRef.current)
    ) {
      previousContentRef.current = contentWithoutIds;
      onChange(contentWithoutIds);
    }
  }, [blocks, onChange]);

  // Move block up or down
  const moveBlock = (blockId: string, direction: "up" | "down") => {
    const currentIndex = blocks.findIndex((block) => block.id === blockId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[currentIndex], newBlocks[newIndex]] = [
      newBlocks[newIndex],
      newBlocks[currentIndex],
    ];
    updateContent(newBlocks);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-default-700">
          Content Editor
        </h3>
        <div className="flex gap-2">
          {CONTENT_TYPES.map(({ key, label, icon: Icon }) => (
            <Button
              key={key}
              variant="flat"
              size="sm"
              startContent={<Icon size={16} />}
              onPress={() => addBlock(key)}
            >
              Add {label}
            </Button>
          ))}
        </div>
      </div>

      {blocks.length === 0 ? (
        <Card>
          <CardBody className="text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="text-default-400">
                <AlignLeft size={48} />
              </div>
              <div>
                <h4 className="text-lg font-medium text-default-600 mb-2">
                  No content blocks yet
                </h4>
                <p className="text-default-400 mb-4">
                  Start building your blog post by adding headings and
                  paragraphs
                </p>
                <div className="flex gap-2 justify-center">
                  {CONTENT_TYPES.map(({ key, label, icon: Icon }) => (
                    <Button
                      key={key}
                      variant="flat"
                      color="primary"
                      startContent={<Icon size={16} />}
                      onPress={() => addBlock(key)}
                    >
                      Add {label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {blocks.map((block, index) => (
            <ContentBlockComponent
              key={block.id}
              block={block}
              index={index}
              totalBlocks={blocks.length}
              onUpdate={updateBlock}
              onMove={moveBlock}
              onRemove={removeBlock}
            />
          ))}
        </div>
      )}

      {blocks.length > 0 && (
        <div className="flex justify-center pt-4">
          <div className="flex gap-2">
            {CONTENT_TYPES.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant="bordered"
                size="sm"
                startContent={<Icon size={16} />}
                onPress={() => addBlock(key)}
              >
                Add {label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {blocks.length > 0 && (
        <div className="text-sm text-default-500 text-center pt-2">
          {blocks.length} content block{blocks.length !== 1 ? "s" : ""} •{" "}
          {blocks.filter((b) => b.text.trim()).length} with content
        </div>
      )}
    </div>
  );
}
