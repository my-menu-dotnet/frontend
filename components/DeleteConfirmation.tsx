import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import Button from "./Button";

type DeleteConfirmationProps = {
  isOpen: boolean;
  onClose?: () => void;
  body?: React.ReactNode;
  header?: React.ReactNode;
  onConfirm?: () => void;
};

export default function DeleteConfirmation({
  isOpen,
  onClose,
  body,
  header,
  onConfirm,
}: DeleteConfirmationProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>{header}</ModalHeader>
            <ModalBody>{body}</ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={onClose}
                text="Cancelar"
              />
              <Button
                data-test="button-modal-delete"
                color="danger"
                text="Enviar"
                onPress={onConfirm}
              />
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
