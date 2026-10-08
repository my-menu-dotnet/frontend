import ColorPicker from "@/components/ColorPicker";
import Select from "@/components/Select";
import SelectItem from "@/components/SelectItem";
import Switch from "@/components/Switch";
import { Slider } from "@/components/ui/slider";
import useUser from "@/hooks/queries/useUser";
import { useEffect, useMemo, useRef, useState } from "react";
import { QRCode as QRCodeGen } from "react-qrcode-logo";
import { useDebounce } from "@uidotdev/usehooks";
import Block from "@/components/Block";
import {
  getQRCodeConfig,
  QRCodeConfig,
  QRCodeDefault,
  saveQRCodeConfig,
} from "@/utils/QRCode";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/qrcode")({
  component: QrCodePage,
});

function QrCodePage() {
  const ref = useRef<QRCodeGen>(null);
  const { company } = useUser();
  const [qrConfig, setQrConfig] = useState<QRCodeConfig | null>(null);

  const debounceConfig = useDebounce(qrConfig, 300);

  const menuUrl = useMemo(
    () =>
      `${import.meta.env.VITE_FRONTEND_URL}/menu/${company?.url}?access_way=QR_CODE`,
    [company?.url]
  );

  const handleChange = (key: string, value: unknown) => {
    setQrConfig((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (debounceConfig) {
      saveQRCodeConfig(debounceConfig);
      ref.current?.forceUpdate();
    }
  }, [debounceConfig]);

  useEffect(() => {
    const config = getQRCodeConfig();
    setQrConfig(config || QRCodeDefault);
  }, []);

  return (
    company &&
    qrConfig !== null && (
      <Block>
        <div className="flex flex-row gap-8">
          <div className="flex flex-row gap-4 flex-1">
            <div className="flex-1 flex flex-col gap-4">
              <h2>QR Code</h2>
              <Select
                label="Densidade"
                value={qrConfig.ecLevel || "L"}
                onValueChange={(v) => handleChange("ecLevel", v)}
              >
                {["L", "M", "Q", "H"].map((level) => (
                  <SelectItem key={level} value={level}>
                    {level}
                  </SelectItem>
                ))}
              </Select>
              <ColorPicker
                label="Cor de fundo"
                value={qrConfig.bgColor}
                onChange={(e) => handleChange("bgColor", e.target.value)}
              />
              <ColorPicker
                label="Cor do QRCOde"
                value={qrConfig.fgColor}
                onChange={(e) => handleChange("fgColor", e.target.value)}
              />
              <Select
                label="Estilo do QRCOde"
                value={qrConfig.qrStyle}
                onValueChange={(v) => handleChange("qrStyle", v)}
              >
                <SelectItem key="squares" value="squares">
                  Quadrado
                </SelectItem>
                <SelectItem key="dots" value="dots">
                  Pontos
                </SelectItem>
                <SelectItem key="fluid" value="fluid">
                  Fluído
                </SelectItem>
              </Select>

              <h2>Eye</h2>
              <ColorPicker
                label="Eye Color"
                value={qrConfig.eyeColor}
                onChange={(e) => handleChange("eyeColor", e.target.value)}
              />
              <Slider
                aria-label="Eye Radius"
                min={0}
                max={20}
                value={[qrConfig.eyeRadius ?? 0]}
                onValueChange={(value) => handleChange("eyeRadius", value[0])}
              />
            </div>
            <div className="flex-1 flex flex-col gap-4">
              <Switch
                isSelected={qrConfig.logoImage}
                onValueChange={(v) => handleChange("logoImage", v)}
              >
                Adicionar logo
              </Switch>

              {qrConfig.logoImage && (
                <>
                  <Switch
                    isSelected={qrConfig.removeQrCodeBehindLogo}
                    onValueChange={(v) =>
                      handleChange("removeQrCodeBehindLogo", v)
                    }
                  >
                    Adicionar fundo branco
                  </Switch>
                  <Slider
                    aria-label="Tamanho da logo"
                    value={[qrConfig.logoWidth ?? 50]}
                    onValueChange={(value) =>
                      handleChange("logoWidth", value[0])
                    }
                    min={10}
                    max={80}
                  />
                  <Slider
                    aria-label="Opacidade da logo"
                    defaultValue={[1]}
                    max={1}
                    min={0}
                    step={0.1}
                    value={[qrConfig.logoOpacity ?? 1]}
                    onValueChange={(value) =>
                      handleChange("logoOpacity", value[0])
                    }
                  />
                  <Slider
                    aria-label="Espaçamento da logo"
                    value={[qrConfig.logoPadding ?? 0]}
                    max={30}
                    onValueChange={(value) =>
                      handleChange("logoPadding", value[0])
                    }
                  />
                </>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h1 className="text-center">{company.name}</h1>
            <QRCodeGen
              value={menuUrl}
              ecLevel={debounceConfig?.ecLevel}
              size={200}
              bgColor={debounceConfig?.bgColor}
              fgColor={debounceConfig?.fgColor}
              logoImage={
                debounceConfig?.logoImage ? company.image : undefined
              }
              logoWidth={debounceConfig?.logoWidth}
              logoOpacity={debounceConfig?.logoOpacity}
              removeQrCodeBehindLogo={debounceConfig?.removeQrCodeBehindLogo}
              logoPadding={debounceConfig?.logoPadding}
              qrStyle={debounceConfig?.qrStyle}
              eyeRadius={debounceConfig?.eyeRadius}
              eyeColor={debounceConfig?.eyeColor}
              ref={ref}
            />
            <div className="text-sm max-w-80 text-center mt-2 text-muted-foreground">
              <p>
                *Esse QrCode redireciona para o seu link personalizado do My
                Menu:
              </p>
              <p className="">{menuUrl}</p>
            </div>
          </div>
        </div>
      </Block>
    )
  );
}
