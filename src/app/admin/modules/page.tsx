"use client";

import { useState, useEffect } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Plus } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/modal";
import UniversalModuleForm from "@/components/admin/universal-module-form";
import ModuleList from "@/components/admin/module-list";
import type {
  ModuleType,
  UniversalModule,
  ModuleCategory,
} from "@/types/universal-module";
import { MODULE_DISPLAY_NAMES } from "@/types/universal-module";

const MODULE_TYPES: ModuleType[] = [
  "study-india",
  "placement-india",
  "placement-abroad",
  "internship-india",
  "internship-abroad",
  "mbbs-india",
  "mbbs-abroad",
  "llm",
  "uni-project",
  "school-project",
  "mou-project",
  "loans",
];

export default function ModulesAdminPage() {
  const [selectedModule, setSelectedModule] =
    useState<ModuleType>("study-india");
  const [modules, setModules] = useState<UniversalModule[]>([]);
  const [categories, setCategories] = useState<ModuleCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingModule, setEditingModule] = useState<UniversalModule | null>(
    null
  );

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Fetch modules for selected type
  useEffect(() => {
    fetchModules();
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModule]);

  const fetchModules = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/modules?moduleType=${selectedModule}`);
      if (response.ok) {
        const data = await response.json();
        setModules(data);
      }
    } catch (error) {
      console.error("Error fetching modules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `/api/modules/categories?moduleType=${selectedModule}`
      );
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleCreate = async (data: unknown) => {
    try {
      // Check if data is FormData or JSON
      const isFormData = data instanceof FormData;

      const response = await fetch("/api/modules", {
        method: "POST",
        ...(isFormData
          ? { body: data as FormData }
          : {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }),
      });

      if (response.ok) {
        await fetchModules();
        onClose();
        setEditingModule(null);
      } else {
        const error = await response.json();
        console.error("Error creating module:", error);
        alert(error.error || "Failed to create module");
      }
    } catch (error) {
      console.error("Error creating module:", error);
      alert("Failed to create module");
    }
  };

  const handleUpdate = async (data: unknown) => {
    if (!editingModule) return;

    try {
      // Check if data is FormData or JSON
      const isFormData = data instanceof FormData;

      const response = await fetch(`/api/modules/${editingModule.id}`, {
        method: "PUT",
        ...(isFormData
          ? { body: data as FormData }
          : {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }),
      });

      if (response.ok) {
        await fetchModules();
        onClose();
        setEditingModule(null);
      } else {
        const error = await response.json();
        console.error("Error updating module:", error);
        alert(error.error || "Failed to update module");
      }
    } catch (error) {
      console.error("Error updating module:", error);
      alert("Failed to update module");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this module?")) return;

    try {
      const response = await fetch(`/api/modules/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchModules();
      }
    } catch (error) {
      console.error("Error deleting module:", error);
    }
  };

  const handleEdit = (module: UniversalModule) => {
    setEditingModule(module);
    onOpen();
  };

  const handleModalClose = () => {
    onClose();
    setEditingModule(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Universal Module Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage all 13 modules with a unified interface
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus size={16} />}
          onPress={onOpen}
        >
          Create New
        </Button>
      </div>

      <Tabs
        selectedKey={selectedModule}
        onSelectionChange={(key) => setSelectedModule(key as ModuleType)}
        variant="underlined"
        classNames={{
          tabList:
            "gap-4 w-full relative rounded-none p-0 border-divider flex-wrap",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-3 h-10",
          tabContent: "group-data-[selected=true]:text-primary text-sm",
        }}
      >
        {MODULE_TYPES.map((moduleType) => (
          <Tab key={moduleType} title={MODULE_DISPLAY_NAMES[moduleType]}>
            <Card className="mt-4">
              <CardBody>
                <ModuleList
                  modules={modules}
                  isLoading={isLoading}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </CardBody>
            </Card>
          </Tab>
        ))}
      </Tabs>

      <Modal
        isOpen={isOpen}
        onClose={handleModalClose}
        size="3xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">
              {editingModule ? "Edit" : "Create"}{" "}
              {MODULE_DISPLAY_NAMES[selectedModule]}
            </h3>
          </ModalHeader>
          <ModalBody className="pb-6">
            <UniversalModuleForm
              moduleType={selectedModule}
              initialData={editingModule || undefined}
              categories={categories}
              onSubmit={editingModule ? handleUpdate : handleCreate}
              onCancel={handleModalClose}
              onCategoriesUpdate={setCategories}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
