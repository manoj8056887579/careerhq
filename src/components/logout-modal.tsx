"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { Icon } from "@iconify/react";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

export function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  userName,
}: LogoutModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <ModalContent>
        {(onModalClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                  <Icon
                    icon="lucide:log-out"
                    className="text-warning text-xl"
                  />
                </div>
                <h2 className="text-xl font-bold">Confirm Logout</h2>
              </div>
            </ModalHeader>
            <ModalBody>
              <p className="text-foreground-600">
                {userName ? (
                  <>
                    Are you sure you want to logout, <strong>{userName}</strong>
                    ?
                  </>
                ) : (
                  "Are you sure you want to logout?"
                )}
              </p>
              <p className="text-sm text-foreground-500 mt-2">
                You will need to verify your email or phone number again to
                access restricted pages.
              </p>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onModalClose}>
                Cancel
              </Button>
              <Button
                color="danger"
                onPress={() => {
                  onConfirm();
                  onModalClose();
                }}
                startContent={<Icon icon="lucide:log-out" />}
              >
                Logout
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
