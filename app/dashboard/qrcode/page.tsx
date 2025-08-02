"use client";

import ColorPicker from "@/components/ColorPicker";
import Select from "@/components/Select";
import SelectItem from "@/components/SelectItem";
import Switch from "@/components/Switch";
import useUser from "@/hooks/queries/useUser";
import { Slider } from "@nextui-org/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { QRCode as QRCodeGen } from "react-qrcode-logo";
import { useDebounce } from "@uidotdev/usehooks";
import Block from "@/components/Block";
import { getQRCodeConfig, QRCodeDefault, saveQRCodeConfig } from "@/utils/QRCode";

export type QRCodeConfig = {
  ecLevel?: "L" | "M" | "Q" | "H";
  bgColor?: string;
  fgColor?: string;
  logoImage?: boolean;
  logoWidth?: number;
  logoOpacity?: number;
  removeQrCodeBehindLogo?: boolean;
  logoPadding?: number;
  qrStyle?: "squares" | "dots" | "fluid";
  eyeRadius?: number;
  eyeColor?: string;
};

export default function QrCode() {
  const ref = useRef<QRCodeGen>(null);
  const { company } = useUser();
  const [qrConfig, setQrConfig] = useState<QRCodeConfig | null>(null);

  const debounceConfig = useDebounce(qrConfig, 300);

  const menuUrl = useMemo(
    () => `${process.env.NEXT_PUBLIC_FRONTEND_URL}/menu/${company?.url}?access_way=QR_CODE`,
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
      <>
        <Block>
          <div className="flex flex-row gap-8">
            <div className="flex flex-row gap-4 flex-1">
              <div className="flex-1 flex flex-col gap-4">
                <h2>QR Code</h2>
                <Select
                  label="Densidade"
                  selectedKeys={["L"]}
                  onChange={(e) => handleChange("ecLevel", e.target.value)}
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
                  onChange={(e) => handleChange("qrStyle", e.target.value)}
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
                  label="Eye Radius"
                  minValue={0}
                  maxValue={20}
                  value={qrConfig.eyeRadius}
                  onChange={(e) =>
                    handleChange("eyeRadius", Array.isArray(e) ? e[0] : e)
                  }
                />
              </div>
              <div className="flex-1 flex flex-col gap-4">
                <Switch
                  isSelected={qrConfig.logoImage}
                  onChange={(e) => handleChange("logoImage", e.target.checked)}
                >
                  Adicionar logo
                </Switch>

                {qrConfig.logoImage && (
                  <>
                    <Switch
                      isSelected={qrConfig.removeQrCodeBehindLogo}
                      onChange={(e) =>
                        handleChange("removeQrCodeBehindLogo", e.target.checked)
                      }
                    >
                      Adicionar fundo branco
                    </Switch>
                    <Slider
                      label="Tamanho da logo"
                      value={qrConfig.logoWidth}
                      onChange={(e) => handleChange("logoWidth", e)}
                      minValue={10}
                      maxValue={80}
                    />
                    <Slider
                      label="Opacidade da logo"
                      defaultValue={1}
                      maxValue={1}
                      minValue={0}
                      step={0.1}
                      value={qrConfig.logoOpacity}
                      onChange={(e) => handleChange("logoOpacity", e)}
                    />
                    <Slider
                      label="Espaçamento da logo"
                      value={qrConfig.logoPadding}
                      maxValue={30}
                      onChange={(e) => handleChange("logoPadding", e)}
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
              <div className="text-sm max-w-80 text-center mt-2 text-gray-400">
                <p>
                  *Esse QrCode redireciona para o seu link personalizado do My
                  Menu:
                </p>
                <p className="">{menuUrl}</p>
              </div>
            </div>
          </div>
        </Block>
      </>
    )
  );
}
