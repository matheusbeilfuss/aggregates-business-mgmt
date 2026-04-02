import { useEffect } from "react";
import { useSettings } from "@/modules/settings/hooks/useSettings";
import { API_URL } from "@/lib/api";
import { getBusinessInitials } from "@/utils";

function buildSvgFavicon(initials: string): string {
  const len = initials.length;
  const fontSize = len <= 1 ? 18 : len <= 2 ? 16 : len <= 4 ? 12 : 9;
  const y = len <= 2 ? 23 : 22;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="8" fill="#0061a4"/>
  <text x="16" y="${y}" font-family="system-ui, sans-serif" font-size="${fontSize}" font-weight="700" fill="white" text-anchor="middle">${initials}</text>
</svg>`.trim();

  const encoded = new TextEncoder().encode(svg);
  const binary = Array.from(encoded)
    .map((b) => String.fromCharCode(b))
    .join("");
  return `data:image/svg+xml;base64,${btoa(binary)}`;
}

async function buildImageFavicon(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext("2d")!;

      const radius = 8;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(32 - radius, 0);
      ctx.quadraticCurveTo(32, 0, 32, radius);
      ctx.lineTo(32, 32 - radius);
      ctx.quadraticCurveTo(32, 32, 32 - radius, 32);
      ctx.lineTo(radius, 32);
      ctx.quadraticCurveTo(0, 32, 0, 32 - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.clip();

      ctx.drawImage(img, 0, 0, 32, 32);

      ctx.strokeStyle = "#0061a4";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(32 - radius, 0);
      ctx.quadraticCurveTo(32, 0, 32, radius);
      ctx.lineTo(32, 32 - radius);
      ctx.quadraticCurveTo(32, 32, 32 - radius, 32);
      ctx.lineTo(radius, 32);
      ctx.quadraticCurveTo(0, 32, 0, 32 - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.stroke();

      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve("");
    img.src = imageUrl;
  });
}

function setFavicon(href: string, type: string) {
  let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.type = type;
  link.href = href;
}

export function useFavicon() {
  const { businessName, businessImgName } = useSettings();

  useEffect(() => {
    if (businessImgName) {
      buildImageFavicon(`${API_URL}/settings/business-image`).then(
        (dataUrl) => {
          if (dataUrl) setFavicon(dataUrl, "image/png");
        },
      );
    } else if (businessName) {
      const initials = getBusinessInitials(businessName);
      setFavicon(buildSvgFavicon(initials), "image/svg+xml");
    }
  }, [businessName, businessImgName]);
}
