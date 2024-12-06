import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import useSendVerifyEmail from "@/hooks/queries/useSendVerifyEmail";
import Button from "@/components/Button";
import Counter from "@/components/Counter";
import RandomEmoji from "@/utils/randomEmoji";

type VerificationEmailProps = {
  code: string;
};

const errors = {
  429: "Espere 1 minuto para enviar outro código",
  403: "Ocorreu um erro ao verificar seu email",
  400: "Código inválido",
  410: "Código expirado",
} as { [key: number | string]: string };

export default function VerificationCode() {
  const inputsRef = useRef<HTMLInputElement[]>([]);
  const router = useRouter();
  const { error, refetch } = useSendVerifyEmail();
  const [allowResend, setAllowResend] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationKey: ["verify-email"],
    mutationFn: async (data: VerificationEmailProps) => {
      return await api.post("/auth/verify-email", data);
    },
    onError: (error: AxiosError) => {
      const status = error.response?.status || 400;
      const emoji = RandomEmoji.sad();

      toast(errors[status], {
        type: "error",
        icon: () => emoji,
      });
    },
    onSuccess: () => {
      router.push("/auth/company");
    },
  });

  const nextInput = (index: number) => {
    if (inputsRef.current[index + 1]) {
      inputsRef.current[index + 1].focus();
    }
  };

  const previousInput = (index: number) => {
    if (inputsRef.current[index - 1]) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleSubmit = () => {
    const code = inputsRef.current.map((input) => input.value).join("");
    mutate({
      code,
    });
  };

  const handlePaste = (e: ClipboardEvent) => {
    const pasteData = e.clipboardData?.getData("text");
    if (pasteData) {
      const pasteValues = pasteData.split("");
      pasteValues.forEach((value, index) => {
        if (inputsRef.current[index]) {
          inputsRef.current[index].value = value;
        }
      });
    }
  };

  useEffect(() => {
    if (!error) return;

    if (error.response?.status === 409) {
      router.push("/dashboard");
      return;
    }

    toast(errors[error.response?.status || 400], {
      type: "error",
      icon: () => "😓",
    });
  }, [error]);

  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    });

    window.addEventListener("paste", handlePaste);

    return () => {
      window.removeEventListener("keydown", () => {});
      window.removeEventListener("paste", () => {});
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-row gap-2">
        {[...Array(6)].map((_, index) => (
          <VerificationInput
            key={index}
            nextInput={index === 5 ? handleSubmit : nextInput}
            previousInput={previousInput}
            inputsRef={inputsRef}
            index={index}
          />
        ))}
      </div>
      <Button
        text="Enviar"
        isLoading={isPending}
        onPress={() => handleSubmit()}
      />
      <div>
        <div className="relative">
          Não recebeu o email?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              toast("Código reenviado", { type: "success", icon: () => "📧" });
              refetch();
            }}
            className="text-primary"
          >
            Reenviar código
          </a>
          <div
            className={
              !allowResend
                ? "absolute w-full h-full bg-white/50 top-0 bottom-0 left-0 right-0"
                : ""
            }
          />
        </div>
        <div className="flex justify-center">
          <Counter
            initialCount={60}
            onEnd={() => {
              setAllowResend(true);
            }}
          />
        </div>
      </div>
    </div>
  );
}

type VerificationInputProps = {
  nextInput: (index: number) => void;
  previousInput: (index: number) => void;
  inputsRef: React.MutableRefObject<HTMLInputElement[]>;
  index: number;
};

function VerificationInput({
  nextInput,
  previousInput,
  inputsRef,
  index,
}: VerificationInputProps) {
  const [value, setValue] = useState("");

  return (
    <input
      ref={(el) => {
        if (el && !inputsRef.current.includes(el)) {
          inputsRef.current.push(el);
        }
      }}
      className="w-12 h-12 border border-gray-300 rounded-lg text-center outline-primary"
      type="text"
      onChange={(e) => {
        const value = e.target.value;
        setValue(value);

        if (value) {
          nextInput(index);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === "Backspace") {
          if (!value) {
            previousInput(index);
          }
        }
      }}
      maxLength={1}
    />
  );
}
