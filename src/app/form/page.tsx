"use client";

import { init, Form } from "@feathery/react";
import { useEffect, useState } from "react";

export default function FormPage() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sdkKey = process.env.NEXT_PUBLIC_FEATHERY_SDK_KEY ?? "defaultSdkKey";
    const formId = process.env.NEXT_PUBLIC_FEATHERY_FORM_ID ?? "defaultFormId";

    console.log("Initializing Feathery with:", { sdkKey, formId });

    if (sdkKey === "defaultSdkKey") {
      console.error("SDK Key is missing");
      return;
    }

    (async () => {
      try {
        await init(sdkKey);
        console.log("Feathery SDK initialized successfully");
        setIsInitialized(true);
      } catch (error) {
        console.error("Feathery SDK initialization failed:", error);
      }
    })();
  }, []);

  const formId = process.env.NEXT_PUBLIC_FEATHERY_FORM_ID ?? "defaultFormId";

  return (
    <div className="text-neutral-100 bg-black flex flex-col items-center justify-center">
        <div className="h-full items-center">
      {isInitialized && formId !== "defaultFormId" ? (
        <Form formId={formId} />
      ) : (
        <p className="">Error: SDK key or Form ID has not been set</p>
      )}
    </div></div>
  );
}
