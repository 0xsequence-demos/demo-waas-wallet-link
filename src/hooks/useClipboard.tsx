import {useToast} from "@0xsequence/design-system";
import {useCallback, useEffect, useState} from "react";

type CopyFn = (text: string) => Promise<void>;
type PasteFn = () => Promise<string | void>;

export const useClipboard = () => {
  const toast = useToast();
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const copy: CopyFn = useCallback(
    async (text) => {
      if (!navigator?.clipboard) {
        throw new Error(
          "Clipboard feature is not supported by your browser! Please try updating your browser to lastest version."
        );
      }

      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
      } catch (error) {
        toast({
          title:
            "Couldn't copy the text to clipboard! It could be due to unsupported or outdated browser.",
          variant: "error"
        });
      }
    },
    [toast]
  );

  const paste: PasteFn = useCallback(async () => {
    if (!navigator?.clipboard) {
      throw new Error(
        "Clipboard feature is not supported by your browser! Please try updating your browser to lastest version."
      );
    }

    try {
      const text = await navigator.clipboard.readText();
      return text;
    } catch (error) {
      toast({
        title:
          "Pasting the text to clipboard failed! It could be due to unsupported or outdated browser.",
        variant: "error"
      });
    }
  }, [toast]);

  useEffect(() => {
    if (isCopied) {
      const timeout = setTimeout(() => {
        setIsCopied(false);
      }, 1500);

      return () => clearTimeout(timeout);
    }
  }, [isCopied]);

  return {copy, isCopied, paste};
};
