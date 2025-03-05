"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { FiLogOut } from "react-icons/fi";
import { MenuItem } from "react-pro-sidebar";
import Button from "../Button";
import { useRouter } from "next/navigation";

export default function Singout() {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { logout } = useAuth();

  return (
    <>
      <MenuItem
        className="text-gray-400"
        icon={<FiLogOut />}
        component={<div onClick={onOpen} />}
      >
        Sair
      </MenuItem>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Sair</ModalHeader>
              <ModalBody>
                <p>Tem certeza que deseja sair?</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                  text="Cancelar"
                />
                <Button
                  color="danger"
                  onPress={() => {
                    logout.mutateAsync().then(() => {
                      router.push("/");
                    });
                    onClose();
                  }}
                  text="Sair"
                />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
