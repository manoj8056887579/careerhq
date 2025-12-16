"use client";

import { useState, useEffect } from "react";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Plus, Building2 } from "lucide-react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/modal";
import UniversalModuleForm from "@/components/admin/universal-module-form";
import ModuleList from "@/components/admin/module-list";
import CompanyForm from "@/components/admin/company-form";
import CompanyList from "@/components/admin/company-list";
import type {
  ModuleType,
  UniversalModule,
  ModuleCategory,
} from "@/types/universal-module";
import { MODULE_DISPLAY_NAMES } from "@/types/universal-module";
import type { Company } from "@/models/Company";

const MODULE_TYPES: ModuleType[] = [
  "study-india",
  "placement-india",
  "placement-abroad",
  "internship-india",
  "internship-abroad",
  "mbbs-india",
  "mbbs-abroad",
  "lms",
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

  // Company management state
  const [companies, setCompanies] = useState<Company[]>([]);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isCompanyModalOpen,
    onOpen: onCompanyModalOpen,
    onClose: onCompanyModalClose,
  } = useDisclosure();

  // Fetch modules for selected type
  useEffect(() => {
    fetchModules();
    fetchCategories();
    if (selectedModule === "placement-india") {
      fetchCompanies();
    }
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

  // Company management functions
  const fetchCompanies = async () => {
    setIsLoadingCompanies(true);
    try {
      const response = await fetch("/api/companies?moduleType=placement-india");
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  const handleCreateCompany = async (data: FormData) => {
    try {
      const response = await fetch("/api/companies", {
        method: "POST",
        body: data,
      });

      if (response.ok) {
        await fetchCompanies();
        onCompanyModalClose();
        setEditingCompany(null);
      } else {
        const error = await response.json();
        console.error("Error creating company:", error);
        alert(error.error || "Failed to create company");
      }
    } catch (error) {
      console.error("Error creating company:", error);
      alert("Failed to create company");
    }
  };

  const handleUpdateCompany = async (data: FormData) => {
    if (!editingCompany) return;

    try {
      const response = await fetch(`/api/companies/${editingCompany.id}`, {
        method: "PUT",
        body: data,
      });

      if (response.ok) {
        await fetchCompanies();
        onCompanyModalClose();
        setEditingCompany(null);
      } else {
        const error = await response.json();
        console.error("Error updating company:", error);
        alert(error.error || "Failed to update company");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      alert("Failed to update company");
    }
  };

  const handleDeleteCompany = async (id: string) => {
    if (!confirm("Are you sure you want to delete this company?")) return;

    try {
      const response = await fetch(`/api/companies/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchCompanies();
      }
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    onCompanyModalOpen();
  };

  const handleCompanyModalClose = () => {
    onCompanyModalClose();
    setEditingCompany(null);
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
        <div className="flex gap-3">
          <Button
            color="primary"
            startContent={<Plus size={16} />}
            onPress={onOpen}
          >
            Create New
          </Button>
          {selectedModule === "placement-india" && (
            <Button
              color="secondary"
              variant="flat"
              startContent={<Building2 size={16} />}
              onPress={onCompanyModalOpen}
            >
              Add Company
            </Button>
          )}
        </div>
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
            <div className="space-y-6 mt-4">
              {moduleType === "placement-india" && (
                <Card>
                  <CardBody>
                    <h2 className="text-xl font-semibold mb-4">Companies</h2>
                    <CompanyList
                      companies={companies}
                      isLoading={isLoadingCompanies}
                      onEdit={handleEditCompany}
                      onDelete={handleDeleteCompany}
                    />
                  </CardBody>
                </Card>
              )}
              <Card>
                <CardBody>
                  <h2 className="text-xl font-semibold mb-4">Modules</h2>
                  <ModuleList
                    modules={modules}
                    isLoading={isLoading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </CardBody>
              </Card>
            </div>
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

      <Modal
        isOpen={isCompanyModalOpen}
        onClose={handleCompanyModalClose}
        size="lg"
      >
        <ModalContent>
          <ModalHeader>
            <h3 className="text-xl font-semibold">
              {editingCompany ? "Edit" : "Add"} Company
            </h3>
          </ModalHeader>
          <ModalBody className="pb-6">
            <CompanyForm
              initialData={editingCompany || undefined}
              onSubmit={editingCompany ? handleUpdateCompany : handleCreateCompany}
              onCancel={handleCompanyModalClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
